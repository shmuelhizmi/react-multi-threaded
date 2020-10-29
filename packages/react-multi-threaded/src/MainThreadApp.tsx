import React from "react";
import Client from "./components/Client";
import { render } from "react-dom";
import { createTransport } from "./Transport";
import { UIComponentClass } from "./components/UIComponent";

const createClient = (
  views: UIComponentClass<(new (props: any) => React.Component)>[],
  ele: HTMLElement | null
) => {
  const transport = createTransport();
  render(<Client transport={transport} views={views} />, ele);
};

export {
	createClient
}