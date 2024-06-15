import { Namespace, Server, Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';
import { createChat } from "../repository/customer.agent.chat.repository"
import { CustomerAgentChatDto } from "../dto/customer.agent.chat.dto";
import { createRoom } from "../repository/customer.ai.room.repository";

export const handleCustomerAgentChat = (socket: Socket, nsp: Namespace) => {

    socket.on('join-room', (roomId: string) => {
        socket.join(roomId)
        const clients = nsp.adapter.rooms.get(roomId);
        if (clients?.size == 2) {
            socket.broadcast.to(roomId).emit('agent-joined', 'Agent joined the room');
        }
    })

    // const roomId = socket.handshake.query.id
    // if (typeof roomId !== 'string') {
    //     nsp.to(socket.id).emit('chat-message', {
    //         errors: ["socket connection failed"]
    //     })
    //     return
    // }
    // socket.join(roomId)

    socket.on('send-chat', async (customerAgentChatDto: CustomerAgentChatDto) => {
        await createChat({
            id: uuidv4(),
            customerAgentRoomId: customerAgentChatDto.roomId,
            name: customerAgentChatDto.name,
            agentId: customerAgentChatDto.userId,
            messageText: customerAgentChatDto.message,
            createdAt: new Date(Date.now())
        })

        nsp.to(customerAgentChatDto.roomId).emit('receive-chat', customerAgentChatDto)
    })

    socket.on('receive-chat', async (customerAgentChatDto: CustomerAgentChatDto) => {

    })

    socket.on("disconnect", () => {
    });
}