import React from "react"
import { render } from "react-dom"
import { Client } from "react-multi-threaded/src"
import * as Components from "./components/UI"
// import { Login } from "./components/UI"

console.log('MainhTreadClient')
render(
    <Client UIComponents={Object.values(Components)} />,
    document.getElementById("main")
)
