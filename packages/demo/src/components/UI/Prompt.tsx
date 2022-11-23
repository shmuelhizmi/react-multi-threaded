import React, { useContext } from "react"
import { ThreadContext, AsUIComponent, WorkerProps } from "react-multi-threaded/src"

const prompt = (props: WorkerProps<{ message: string; onOk: () => void }>) => {
    const context = useContext(ThreadContext)

    return <div>
        <h1>{props.message}</h1>
        {props.children}
        <button onClick={() => {
            console.log(context, 'Prompt onClick') //main
            props.onOk() //worker call
        }}>ok</button>
    </div>
}
export const Prompt = AsUIComponent(prompt)