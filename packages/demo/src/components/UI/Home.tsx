import React from "react"
import { UIComponentProps, AsUIComponent } from "react-multi-threaded"


const Home = (props: UIComponentProps<{ username: string; logout: () => void }>) => {
    return <div>
        <h1>Hello - {props.username}</h1>
        {props.children}
        <button onClick={() => props.logout()}>logout</button>
    </div>
}

export default AsUIComponent(Home)