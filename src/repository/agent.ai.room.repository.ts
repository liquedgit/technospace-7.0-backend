import { AgentAIRoom } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createRoom = async (agentAIRoom: AgentAIRoom) => {
    const result = await prisma.agentAIRoom.create({
        data: { ...agentAIRoom },
        select: {
            id: true,
            chats: true,
            createdAt: true,
            agent: true,
            agentId: true,
        },
    });
    return result;
};