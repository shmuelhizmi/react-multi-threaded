import React from "react"
import { WorkerRender } from "react-multi-threaded/src/WorkerRender"
import { WorkerApp } from "./components/Layout/WorkerApp"

export const WorkerAppChannel = 'WorkerApp'

WorkerRender(<WorkerApp />, WorkerAppChannel)
