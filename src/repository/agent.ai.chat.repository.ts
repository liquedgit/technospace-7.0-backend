import { AgentAIChat } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createChat = async (agentAIChat: AgentAIChat) => {
    const result = await prisma.agentAIChat.create({
        data: { ...agentAIChat },
        select: {
            id: true,
            agent: true,
            agentId: true,
            name: true,
            agentAIRoom: true,
            agentAIRoomId: true,
            createdAt: true,
            messageText: true,
        },
    });
    return result;
};