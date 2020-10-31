import { AppTransport, tranportBroadcastName } from "./types";

const createTransport = (): AppTransport => {
  const transport = new BroadcastChannel(tranportBroadcastName);
  return {
    emit: (event: string, message: any) => transport.postMessage({ event, message }),
    on: (event: string, handler: (data: any) => void) =>
      transport.addEventListener("message", (newMessage) => {
        if (newMessage.data?.event === event) {
          handler(newMessage.data?.message);
        }
      }),
  };
};
export {
	createTransport
}