import React from "react"
import { AsUIComponent, UIComponentProps } from "react-multi-threaded"


const Prompt = (props: UIComponentProps<{ message: string; onOk: () => void }>) => {
    return <div>
        <h1>{props.message}</h1>
        {props.children}
        <button onClick={() => props.onOk()}>ok</button>
    </div>

}

export default AsUIComponent(Prompt)