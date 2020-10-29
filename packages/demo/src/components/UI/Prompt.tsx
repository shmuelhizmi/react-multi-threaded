import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Prompt extends UIComponent<{ message: string; onOk: () => void }> {
  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        {this.props.children}
        <button onClick={() => this.props.onOk()}>ok</button>
      </div>
    );
  }
}
export default AsUIComponent(Prompt);