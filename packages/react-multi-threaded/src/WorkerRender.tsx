import { AppTransport } from "./types"
import { createTransport } from "./Transport"
import { WorkerHost } from "./WorkerHost"


export const WorkerRender = (appTree: JSX.Element, transportName: string/* transport?: AppTransport */) => {
    // const appTransport = transport || createTransport()
    const appTransport = createTransport(transportName)
    const host = new WorkerHost(appTree)
    host.addClient(appTransport)
    host.startServer(appTransport)

    // return {
    //     pause: app.pauseApp,
    //     continue: app.resumeApp,
    // }

    return host
}

