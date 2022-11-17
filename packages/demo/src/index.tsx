import React from "react"
import { render } from "react-dom"
import { createRoot } from 'react-dom/client'
import { Client } from "react-multi-threaded/src"
import * as Components from "./components/UI"


new Worker("./worker.bundle.js")

const container = document.getElementById("main")
const sub = document.getElementById("sub")
const root = createRoot(container)
root.render(<Client id="mainClient" Components={[...Object.values(Components)]} channel="WorkerApp" />,)

new Worker("./footer.bundle.js")

const bdy = createRoot(sub)
bdy.render(<Client id="subClient" Components={[...Object.values(Components)]} channel="Footer" />,)
