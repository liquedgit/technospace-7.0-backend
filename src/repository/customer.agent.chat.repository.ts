import { CustomerAgentChat } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createChat = async (customerAgentChat: CustomerAgentChat) => {
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
};