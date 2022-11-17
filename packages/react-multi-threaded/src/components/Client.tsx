import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { v4 } from "uuid"
import { ShareableViewData } from "../WorkerHost"
import { AppTransport } from "../types"
import { createTransport } from "../Transport"
import { AnyComponent } from "./UIComponent"
import { RootReactMultiThreadedComponent } from "./RootComponent"
import { ThreadContext } from "../Contexts"

interface ClientState { runningViews: ShareableViewData[] }

const stringifyWithoutCircular = (json: any) => {
    // to avoid crash while using circular props
    const getCircularReplacer = () => {
        const seen = new WeakSet()
        return (_key: string, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return
                }
                seen.add(value)
            }
            return value
        }
    }

    return JSON.stringify(json, getCircularReplacer())
}

console.log('Client')
export const Client = (props: { id?: string, /* transport?: AppTransport; */channel: string, Components: AnyComponent<any>[] }) => {
    const [state, setState] = useState<ClientState>({ runningViews: [], })
    // const transport = useMemo(() => props.transport || createTransport(), [])
    const transport = useMemo(() => createTransport(props.channel), [])
    // const context = useContext(ThreadContext) //main

    const UIComponents = useMemo(() => [...props.Components, RootReactMultiThreadedComponent], [])

    console.log("Client", props.id)
    useEffect(() => {
        transport.on("update_views_tree", ({ views }: { views: ShareableViewData[] }) => setState({ runningViews: views }))

        transport.on("update_view",
            ({ view }: { view: ShareableViewData }) =>
                setState((() => {
                    const runningViewIndex = state.runningViews.findIndex((currentView) => currentView.uid === view.uid)
                    if (runningViewIndex !== -1)
                        state.runningViews[runningViewIndex] = view
                    else
                        state.runningViews.push(view)

                    return { runningViews: [...state.runningViews] }
                })())
        )

        transport.on("delete_view", ({ viewUid }: { viewUid: string }) => {
            const runningViewIndex = state.runningViews.findIndex((view) => view.uid === viewUid)

            if (runningViewIndex !== -1) {
                state.runningViews.splice(runningViewIndex, 1)
                setState({ runningViews: [...state.runningViews] })
            }
        }
        )
        transport.on("on_worker_start", () => transport.emit("request_views_tree"))
    }, [])

    const renderView = useCallback((view: ShareableViewData): JSX.Element => {
        const componentToRender = UIComponents.find((component) => component.name === view.name)

        if (componentToRender) {
            const props: any = { key: view.uid }
            view.props.forEach((prop) => {
                if (prop.type === "data")
                    props[prop.name] = prop.data
                else if (prop.type === "event")
                    [
                        (props[prop.name] = (...args: any) => {
                            return new Promise((resolve) => {
                                const requestUid = v4()
                                transport.on("respond_to_event", ({ data, uid, eventUid, }: { data: any, uid: string, eventUid: string }) => {
                                    if (uid === requestUid && eventUid === prop.uid)
                                        resolve(data)
                                })

                                transport.emit("request_event", {
                                    eventArguments: JSON.parse(stringifyWithoutCircular(args)),
                                    eventUid: prop.uid,
                                    uid: requestUid,
                                })
                            })
                        }),
                    ]
            })
            const children = state.runningViews
                .filter((runningView) => runningView.parentUid === view.uid)
                .sort((a, b) => a.childIndex - b.childIndex)
                .map((runningView) => renderView(runningView))

            return React.createElement(componentToRender, {
                ...props,
                children: children.length > 0 ? children : undefined,
            })
        }
        throw new Error(`missing componnent ${view.name} please pass/register it to the UIComponents array`)
    }, [transport, state])

    const root = state.runningViews.find((view) => view.isRoot)

    return (!root) ? <></> : renderView(root)
}

