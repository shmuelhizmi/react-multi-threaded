import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Gif extends UIComponent<{ url: string }> {
  render() {
    return (
      <div>
        <img src={this.props.url} />
      </div>
    );
  }
}
export default AsUIComponent(Gif);
