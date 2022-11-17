import React from "react"
import type { WorkerHost as WorkerHost } from "./WorkerHost"

export const WorkerAppContext = React.createContext<WorkerHost | undefined>(undefined)

export const ThreadContext = React.createContext<"worker" | "main">("main")
