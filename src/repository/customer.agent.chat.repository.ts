import { CustomerAgentChat } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';
import { getCustomerAgentRoomById } from './customer.agent.room.repository';
import { finishedCustomerAgentRoomState, pendingCustomerAgentRoomState } from '../util/constant';

const prisma = DBClient.getInstance().prisma;

export const createChat = async (customerAgentChat: CustomerAgentChat) => {

    const room = await getCustomerAgentRoomById(customerAgentChat.customerAgentRoomId)

    if (room != null && room.state != finishedCustomerAgentRoomState && room.state != pendingCustomerAgentRoomState) {
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
        return result;
    }
    return null;
};

