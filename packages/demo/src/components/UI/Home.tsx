import React from "react"
import { UIComponentProps, AsUIComponent } from "react-multi-threaded/src"


const home = (props: UIComponentProps<{ username: string; logout: () => void }>) => <div>
    <h1>Hello - {props.username}</h1>
    {props.children}
    <button onClick={() => props.logout()}>logout</button>
</div>

export const Home = AsUIComponent(home)