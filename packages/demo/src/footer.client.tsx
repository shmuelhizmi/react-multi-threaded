import React from "react"
import * as Components from "./components/UI"
import { Client, UI } from "react-multi-threaded/src"
import { FooterChannel } from "./footer.worker"

export const FooterClient = () => {
    new Worker(new URL('./footer.worker', import.meta.url))
    return <Client components={[...Object.values(Components)]} channel={FooterChannel} />
}
