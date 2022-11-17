import React from "react"
import { WorkerProps, AsUIComponent } from "react-multi-threaded/src"

export const Gif = AsUIComponent((props: WorkerProps<{ url: string }>) => <div>
    <img src={props.url} />
</div>)

// export default AsUIComponent(Gif)
