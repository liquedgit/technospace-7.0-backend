import { CustomerAgentChat } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';
import { getCustomerAgentRoomById } from './customer.agent.room.repository';
import { finishedCustomerAgentRoomState, pendingCustomerAgentRoomState } from '../util/constant';

const prisma = DBClient.getInstance().prisma;

export const createChat = async (customerAgentChat: CustomerAgentChat) => {

    const room = await getCustomerAgentRoomById(customerAgentChat.customerAgentRoomId)

    console.log(room)
    console.log(room!.state)

    if (room != null && room.state != finishedCustomerAgentRoomState && room.state != pendingCustomerAgentRoomState) {

        console.log("masuk if buat")
        const result = await prisma.customerAgentChat.create({
            data: { ...customerAgentChat },
            select: {
                id: true,
                agentId: true,
                agent: true,
                createdAt: true,
                customerAgentRoom: true,
                customerAgentRoomId: true,
                messageText: true,
                name: true,
            },
        });

        console.log(result)
        return result;
    }
    return null;
};

