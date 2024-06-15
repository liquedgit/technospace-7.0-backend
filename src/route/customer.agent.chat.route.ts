import { Namespace, Server, Socket } from "socket.io"
import { handleCustomerAgentChat } from "../controller/customer.agent.chat.controller"

export const customerAgentChatRoute = (io: Server) => {
    const nsp: Namespace = io.of("/chats/customer-agent")

    nsp.on('connection', (socket: Socket) => {
        console.log("asdasd")
        handleCustomerAgentChat(socket, nsp)
    })
}