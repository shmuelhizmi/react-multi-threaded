import React from "react";

import { AsUIComponent, UIComponentProps } from "./UIComponent";

const RootReactMultiThreadedComponent = (props: UIComponentProps<{}>) => {
  return <> {props.children} </>;
};

export default AsUIComponent(RootReactMultiThreadedComponent);
