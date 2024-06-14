import { CustomerAIRoom } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createRoom = async (customerAIRoom: CustomerAIRoom) => {
    const result = await prisma.customerAIRoom.create({
        data: { ...customerAIRoom },
        select: {
            id: true,
            chats: true,
            customerName: true,
            customerEmail: true,
            createdAt: true,
        },
    });
    return result;
};