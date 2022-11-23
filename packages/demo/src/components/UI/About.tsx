import React from "react"
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"


const about = (props: WorkerProps<{}>) => <div>
    <h1>About</h1>
</div>

export const About = AsUIComponent(about)