import React from "react"
import { WorkerRender } from "react-multi-threaded/src/WorkerRender"
import { WorkerApp } from "./components/Layout/WorkerApp"

WorkerRender(<WorkerApp />, 'WorkerApp')
