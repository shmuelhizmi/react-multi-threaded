import React from "react"
import { AsUIComponent, UIComponentProps } from "react-multi-threaded/src"


const prompt = (props: UIComponentProps<{ message: string; onOk: () => void }>) => <div>
    <h1>{props.message}</h1>
    {props.children}
    <button onClick={() => props.onOk()}>ok</button>
</div>

export const Prompt = AsUIComponent(prompt)