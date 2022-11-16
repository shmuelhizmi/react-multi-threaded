import React from "react"

import { AsUIComponent, UIComponentProps } from "./UIComponent"

const RootReactMultiThreadedComponent = (props: UIComponentProps<{}>) => <>{props.children}</>

export default AsUIComponent(RootReactMultiThreadedComponent)
