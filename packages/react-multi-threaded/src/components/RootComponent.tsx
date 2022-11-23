import React from "react"

import { AsUIComponent, WorkerProps } from "./UIComponent"

const rootReactMultiThreadedComponent = (props: WorkerProps<{}>) => <>{props.children}</>

export const RootReactMultiThreadedComponent = AsUIComponent(rootReactMultiThreadedComponent)
