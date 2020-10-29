import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Login extends UIComponent<
  { login: (username: string, password: string) => void },
  { username: string; password: string }
> {
  state = {
    username: "",
    password: "",
  };
  render() {
    return (
      <div>
        <input
          type="text"
          onChange={(e) => this.setState({ username: e.target.value })}
          placeholder="username"
        />
        <input
          type="text"
          onChange={(e) => this.setState({ password: e.target.value })}
          placeholder="password"
        />
        <button
          onClick={() =>
            this.props.login(this.state.username, this.state.password)
          }
        >
          LogIn
        </button>
      </div>
    );
  }
}
export default AsUIComponent(Login);
