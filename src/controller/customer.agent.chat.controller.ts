import { Namespace, Server, Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';
import { createChat } from "../repository/customer.agent.chat.repository"
import { CustomerAgentChatRequestDto } from "../dto/customer.agent.chat.request.dto";
import { CustomerAgentChatResponseDto } from "../dto/customer.agent.chat.response.dto";
import { createRoom } from "../repository/customer.ai.room.repository";

export const handleCustomerAgentChat = (socket: Socket, nsp: Namespace) => {


    socket.on('join-room-customer', (roomId: string) => {
        console.log("customer join")
        socket.join(roomId)
    })


    socket.on('join-room-agent', (roomId: string, agentName: string) => {
        console.log("agent join")
        socket.join(roomId)
        // const clients = nsp.adapter.rooms.get(roomId);
        // if (clients?.size == 2) {
        // console.log("asdasd")
        socket.broadcast.to(roomId).emit('agent-joined', agentName);
        // }
    })

    // const roomId = socket.handshake.query.id
    // if (typeof roomId !== 'string') {
    //     nsp.to(socket.id).emit('chat-message', {
    //         errors: ["socket connection failed"]
    //     })
    //     return
    // }
    // socket.join(roomId)

    socket.on('send-chat', async (customerAgentChatDto: CustomerAgentChatRequestDto) => {
        const chat = await createChat({
            id: uuidv4(),
            customerAgentRoomId: customerAgentChatDto.roomId,
            name: customerAgentChatDto.name,
            agentId: customerAgentChatDto.userId,
            messageText: customerAgentChatDto.message,
            createdAt: new Date(Date.now())
        })

        if (chat != null) {
            const response: CustomerAgentChatResponseDto = {
                chatId: chat.id,
                roomId: chat.customerAgentRoomId,
                createdAt: chat.createdAt,
                message: chat.messageText,
                name: chat.name,
                userId: chat.agentId
            }

            nsp.to(customerAgentChatDto.roomId).emit('receive-chat', response)
        }

        nsp.to(customerAgentChatDto.roomId).emit('receive-chat', { errors: ["error sending chat"] })
    })

    // socket.on('receive-chat', async (customerAgentChatDto: CustomerAgentChatDto) => {

    // })

    socket.on("disconnect", () => {
    });
}

