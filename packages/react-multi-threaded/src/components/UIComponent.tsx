import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { v4 } from "uuid"
import { ThreadContext, WorkerAppContext } from "../Contexts"
import { createFunction } from '../utils/createFunction'

const ViewParentContext = React.createContext<{ uid: string; childIndex: number } | undefined>(undefined)

type MapResultToPromise<T> = T extends (...args: infer U) => infer R
    ? R extends Promise<any>
    ? (...args: U) => R
    : (...args: U) => Promise<R>
    : T

export type ToPromiseProps<Props> = { [Key in keyof Props]: MapResultToPromise<Props[Key]> }

export type ThreadProps<Props extends ToPromiseProps<any>> = Props extends ToPromiseProps<infer OriginalProps> ? OriginalProps : never

export type WorkerProps<Props> = ToPromiseProps<React.PropsWithChildren<Props>>

type FunctionComponent<P> = (props: P) => React.ReactElement

type ClassComponent<P> = new (props: P) => React.Component<P, any>

export type AnyComponent<P> = FunctionComponent<P> | ClassComponent<P>

// type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends AnyComponent<infer TProps> ? TProps : TComponentOrTProps

// export const AsUIComponent = <Component extends FunctionComponent<any> | ClassComponent<any>>(component: Component) =>
export const AsUIComponent = <Props extends { children?: ReactNode | ReactNode[] }>(component: FunctionComponent<Props> | ClassComponent<Props>) =>
    createFunction(component.name, (props: Props) => <MainThreadContainer component={component} props={props} />)

interface UIComponentContainerProps<P extends { children?: ReactNode | ReactNode[] }> {
    component: FunctionComponent<P> | ClassComponent<P>
    props: P
}

const MainThreadContainer = <Props extends { children?: ReactNode | ReactNode[] }>
    (props: UIComponentContainerProps<Props> & { children?: ReactNode | ReactNode[] }) => {

    const context = useContext(ThreadContext)
    const uid = useMemo(() => v4(), [])
    const worker = useContext(WorkerAppContext)
    const parent = useContext(ViewParentContext)

    if (worker)
        worker.deleteRunningView(uid)

    useEffect(() => () => {
        if (worker)
            worker.deleteRunningView(uid)
    }, [])

    const workerRender = () => {
        return !worker ? <></> :
            (() => {
                worker.updateRunningView({
                    parentUid: parent?.uid || "",
                    isRoot: parent === undefined,
                    childIndex: parent?.childIndex || 0,
                    name: props.component.name,
                    props: props.props,
                    uid: uid,
                })
                if (Array.isArray(props.children))
                    return <>{(props.props.children as JSX.Element[]).map(
                        (child, index) => (
                            <ViewParentContext.Provider key={index} value={{ uid: uid, childIndex: index }}>
                                {child}
                            </ViewParentContext.Provider>
                        )
                    )}</>
                else
                    return (
                        <ViewParentContext.Provider value={{ uid: uid, childIndex: 0 }}>
                            {props.props.children}
                        </ViewParentContext.Provider>
                    )
            })()
    }

    const Component = props.component
    return context === "worker" ? workerRender() : React.createElement(Component, props.props)
}

