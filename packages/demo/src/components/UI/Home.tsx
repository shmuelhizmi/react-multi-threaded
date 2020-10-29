import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Home extends UIComponent<{ username: string; logout: () => void }> {
  render() {
    return (
      <div>
        <h1>Hello - {this.props.username}</h1>
        {this.props.children}
        <button onClick={() => this.props.logout()}>logout</button>
      </div>
    );
  }
}

export default AsUIComponent(Home);