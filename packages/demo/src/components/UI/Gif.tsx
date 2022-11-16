import React from "react"
import { UIComponentProps, AsUIComponent } from "react-multi-threaded/src"

export const Gif = AsUIComponent((props: UIComponentProps<{ url: string }>) => <div>
    <img src={props.url} />
</div>)

// export default AsUIComponent(Gif)
