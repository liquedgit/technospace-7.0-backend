import { CustomerAgentRoom } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';
import { onGoingCustomerAgentRoomState, pendingCustomerAgentRoomState } from '../util/constant';

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

export const getRoomByState = async (state: string, agentId: string | null) => {

    if (agentId != null) {
        const result = await prisma.customerAgentRoom.findMany({
            where: {
                state: state,
                agentId: agentId
            },
            select: {
                id: true,
                createdAt: true,
                agent: true,
                agentId: true,
                customerEmail: true,
                customerName: true,
                state: true,
            },
        })

        return result
    }

    const result = await prisma.customerAgentRoom.findMany({
        where: {
            state: state
        },
        select: {
            id: true,
            createdAt: true,
            agent: true,
            agentId: true,
            customerEmail: true,
            customerName: true,
            state: true,
        },
    })

    return result
}

export const acceptCustomerAgent = async (customerAgentRoomId: string, agentId: string): Promise<boolean> => {
    const result = await prisma.customerAgentRoom.update({
        where: {
            id: customerAgentRoomId
        },
        data: {
            agentId: agentId,
            state: onGoingCustomerAgentRoomState
        },
    })

    return !!result
}