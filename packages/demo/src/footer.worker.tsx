import React from "react"
import { WorkerRender } from "react-multi-threaded/src/WorkerRender"
import { Footer } from "./components/UI"

const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
console.log('Loading footer, isWorker', isWorker)

export const FooterChannel = 'Footer'

WorkerRender(<Footer onTimer={v => {
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

    console.log('isWorker: ', isWorker, v) //run in worker

    return null
}}>
</Footer>, FooterChannel)
