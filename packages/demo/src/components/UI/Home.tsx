import React from "react"
//use - from "react-multi-threaded" if npm-ed
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"

const home = (props: WorkerProps<{ username: string; logout: () => void }>) => <div>
    <h1>Hello - {props.username}</h1>
    {props.children}
    <button onClick={() => props.logout()}>logout</button>
</div>

export const Home = AsUIComponent(home)