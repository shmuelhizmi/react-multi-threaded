import React from "react"
import { render } from "react-dom"
import { createRoot } from 'react-dom/client'
import { Client } from "react-multi-threaded/src"
import * as Components from "./components/UI"

new Worker(new URL('./app.worker', import.meta.url))

const container = document.getElementById("main")
const sub = document.getElementById("sub")
const root = createRoot(container)
root.render(<Client Components={[...Object.values(Components)]} channel="WorkerApp" />,)

new Worker(new URL('./footer.worker', import.meta.url))

const bdy = createRoot(sub)
bdy.render(<Client Components={[...Object.values(Components)]} channel="Footer" />,)
