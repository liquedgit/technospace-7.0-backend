import { CustomerAgentRoom } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';
import { finishedCustomerAgentRoomState, onGoingCustomerAgentRoomState, pendingCustomerAgentRoomState } from '../util/constant';

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


export const getCustomerAgentRoomById = async (customerAgentRoomId: string) => {
    const result = await prisma.customerAgentRoom.findUnique({
        where: {
            id: customerAgentRoomId
        },
        select: {
            id: true,
            createdAt: true,
            agent: true,
            agentId: true,
            customerEmail: true,
            customerName: true,
            state: true,
        }
    })

    return result
}

export const getAllRoomByState = async (state: string, agentId: string | null) => {

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



export const getRoomByState = async (state: string, agentId: string | null, pageNumber: number, perPage: number) => {
    const skip: number = (pageNumber <= 1) ? 0 : (pageNumber-1) * perPage
    if (agentId != null) {
        const result = await prisma.customerAgentRoom.findMany({
            where: {
                state: state,
                agentId: agentId
            },
            skip: skip,
            take: perPage,
            select: {
                id: true,
                createdAt: true,
                agent: true,
                agentId: true,
                customerEmail: true,
                customerName: true,
                state: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return result
    }

    const result = await prisma.customerAgentRoom.findMany({
        where: {
            state: state
        },
        skip: skip,
        take: perPage,
        select: {
            id: true,
            createdAt: true,
            agent: true,
            agentId: true,
            customerEmail: true,
            customerName: true,
            state: true,
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return result
}

export const getRoomById = async (customerAgentRoomId: string) => {
    const result = await prisma.customerAgentRoom.findUnique({
        where: {
            id: customerAgentRoomId
        },
        select: {
            id: true,
            createdAt: true,
            agent: true,
            agentId: true,
            customerEmail: true,
            customerName: true,
            state: true,
            customerAgentChats: {
                select: {
                    agent: true,
                    agentId: true,
                    createdAt: true,
                    id: true,
                    messageText: true,
                    name: true
                }
            }
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

export const markFinishedCustomerAgent = async (customerAgentRoomId: string): Promise<boolean> => {
    const result = await prisma.customerAgentRoom.update({
        where: {
            id: customerAgentRoomId
        },
        data: {
            state: finishedCustomerAgentRoomState
        },
    })

    return !!result
}