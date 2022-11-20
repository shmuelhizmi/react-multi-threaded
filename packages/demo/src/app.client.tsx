import React from "react"
import * as Components from "./components/UI"
import { Client, UI } from "react-multi-threaded/src"
import { WorkerAppChannel } from "./app.worker"

export const WorkerClient = () => {
    new Worker(new URL('./app.worker', import.meta.url))

    return <Client components={[...Object.values(Components)]} channel={WorkerAppChannel} />
}
