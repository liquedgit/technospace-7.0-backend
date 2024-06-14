import { CustomerAgentRoom } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createRoom = async (customerAgentRoom: CustomerAgentRoom) => {
    const result = await prisma.customerAgentRoom.create({
        data: { ...customerAgentRoom },
        select: {
            id: true,
            createdAt: true,
            agent: true,
            agentId: true,
            customerEmail: true,
            customerName: true,
            state: true,
        },
    });
    return result;
};