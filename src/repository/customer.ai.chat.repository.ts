import { CustomerAIChat } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createChat = async (customerAIChat: CustomerAIChat) => {
    const result = await prisma.customerAIChat.create({
        data: { ...customerAIChat },
        select: {
            id: true,
            customerAIRoom: true,
            customerAIRoomId: true,
            name: true,
            messageText: true,
            createdAt: true,
        },
    });
    return result;
};