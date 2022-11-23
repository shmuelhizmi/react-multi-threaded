import { AppTransport } from "./types"

export const createTransport = (channel: string): AppTransport => {
    const transport = new BroadcastChannel(channel)
    return {
        emit: (event: string, message: any) => transport.postMessage({ event, message }),
        on: (event: string, handler: (data: any) => void) =>
            transport.addEventListener("message", (newMessage) => {
                if (newMessage.data?.event === event) {
                    handler(newMessage.data?.message)
                }
            }),
    }
}