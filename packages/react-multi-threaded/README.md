<h1 align="center">
  React Multi-Threaded
</h1>
<p align="center">
  create FAST multi-threaded React Apps - one App two threads
</p>

## What is "React Multi-Threaded"

"React Multi-Threaded" is a typescript framework that lets you transform your existing/new React-App from a single-threaded Web-App into a multi-threaded faster Web-App.

## How does it work?

In "React Multi-Threaded" you have two different types of components

- UI Component - UI Components are components that run on the main thread since every interaction with the dom must be fired from the main thread.
- Layout/Logic Component - Layout/Logic-Components are components that run on the web-worker thread they are used for data fetching, logic, and layouts.

with "React Multi-Threaded" you can build your app from a mix of those two types of components and "React Multi-Threaded" will separate them into
one UI thread with your UI Components and one business logic web-worker thread with your Layout/Logic Components

## How do I get started

start by installing the "React Multi-Threaded" with `npm install react-multi-threaded`
and configure your webpack configuration with two app entry points, one to the main thread and one for the web-worker.  
`// webpack.config.js example`

```js
const path = require("path");

module.exports = {
  mode: "none",
  entry: {
    main: path.join(__dirname, "src", "main.js"),
    worker: path.join(__dirname, "src", "index.jsx"),
  },
  target: "web",
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      // here place your babel or typescript loader
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

we also need to create a html index
`// html index.html example`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DEMO</title>
  </head>
  <body>
    <div id="main" />
    <script src="main.bundle.js"></script>
    <script>
      new Worker("./worker.bundle.js");
    </script>
  </body>
</html>
```

now that we got done with the technical stuff, let's move on to some programing  
we first need to create a basic react-app with one exception: we need to separate our UI components from our layout components

let's start with some UI components
`// src/components/UI/Home.jsx`

```jsx
import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Home extends UIComponent {
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
```

`// src/components/UI/Login.jsx`

```jsx
import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Login extends UIComponent {
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
```

`// src/components/UI/Prompt.jsx`

```jsx
import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Prompt extends UIComponent {
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
```

`// src/components/UI/Gif.jsx`

```jsx
import React from "react";
import { UIComponent, AsUIComponent } from "react-multi-threaded";

class Gif extends UIComponent {
  render() {
    return (
      <div>
        <img src={this.props.url} />
      </div>
    );
  }
}
export default AsUIComponent(Gif);
```

now let's move on to some layout components
`// src/components/Layout/App.jsx`

```jsx
import React, { useState } from "react";
import Gif from "../UI/Gif";
import Home from "../UI/Home";
import Login from "../UI/Login";
import Prompt from "../UI/Prompt";

const App = () => {
  const [location, setLocation] =
    (useState < "home") | "error" | ("login" > "login");
  const [name, setName] = useState("");
  return (
    <>
      {location === "home" && (
        <Home logout={() => setLocation("login")} username={name}>
          <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
          <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
        </Home>
      )}
      {location === "login" && (
        <Login
          login={(username, password) => {
            if (password === "0000") {
              setName(username);
              setLocation("home");
            } else {
              setLocation("error");
            }
          }}
        />
      )}
      {location === "error" && (
        <Prompt message={"worng password"} onOk={() => setLocation("login")}>
          <Gif url="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif" />
        </Prompt>
      )}
    </>
  );
};

export default App;
```

now that we fisnish creating our App body we need to set app two app entry points, one for the main thread bundle and one for the web-worker bundle  
the main thread index will be called `main.jsx`
`// src/main.js example`

```js
import React from "react";
import { render } from "react-dom";
import { MainThreadClient } from "react-multi-threaded";
import { createClient } from "react-multi-threaded";
import Home from "./components/UI/Home";
import Login from "./components/UI/Login";
import Prompt from "./components/UI/Prompt";
import Gif from "./components/UI/Gif";

// we are creating a client and passing it all of our UI-Components
render(
  <MainThreadClient UIComponents={[Home, Login, Prompt, Gif]} />,
  document.getElementById("main")
);
```

that's should be it for the main thread index, moving on to the the web worker thread index.
the web worker index will be called `index.jsx` in our example
`// src/index.jsx example`

```jsx
import React from "react";
import { RenderApp } from "react-multi-threaded";
import App from "./components/Layout/App";

RenderApp(<App />);
```

<b>It is finished, we now have a multi-threaded react app</b>
![example screenshot](./assets/demo-screenshot.png)

<p align="center">we can see in the screenshot above that the App component from `App.jsx` is missing in the react dev-tools tree, that is because it is running on a spearate web worker</p>
