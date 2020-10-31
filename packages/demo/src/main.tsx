import React from "react";
import { render } from "react-dom";
import { MainThreadClient } from "react-multi-threaded";
import Components from "./components/UI";

render(
  <MainThreadClient UIComponents={Components} />,
  document.getElementById("main")
);
