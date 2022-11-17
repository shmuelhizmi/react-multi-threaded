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

type ToPromiseProps<Props extends Record<string, any>> = { [Key in keyof Props]: MapResultToPromise<Props[Key]> }

export type ThreadProps<Props extends ToPromiseProps<any>> = Props extends ToPromiseProps<infer OriginalProps> ? OriginalProps : never

export type WorkerProps<Props extends Record<string, any>> = ToPromiseProps<React.PropsWithChildren<Props>>

type FunctionComponent<P> = (props: P) => React.ReactElement

type ClassComponent<P> = new (props: P) => React.Component<P, any>

export type AnyComponent<P> = FunctionComponent<P> | ClassComponent<P>

type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends AnyComponent<infer TProps> ? TProps : TComponentOrTProps

export const AsUIComponent = <Component extends FunctionComponent<any> | ClassComponent<any>>(component: Component) =>
    createFunction(component.name, (props: ThreadProps<ExtractProps<Component>>) =>
        <MainThreadContainer<ExtractProps<Component>, Component>
            component={component}
            props={props as ExtractProps<Component>}
        />
    )

interface UIComponentContainerProps<C, P extends { children?: ReactNode | ReactNode[] }> {
    component: C
    props: P
}

console.log('MainThreadContainer')
const MainThreadContainer = <Props extends { children?: ReactNode | ReactNode[] }, Component extends FunctionComponent<Props> | ClassComponent<Props>>(props: UIComponentContainerProps<Component, Props> & { children?: ReactNode | ReactNode[] }) => { //<Props extends Record<string, any>, Component extends FunctionComponent<Props> | ClassComponent<Props>>
    // extends React.Component<UIComponentContainerProps<Component, Props> & { children?: ReactNode | ReactNode[] }> {

    // static contextType = AppTypeContext;
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

