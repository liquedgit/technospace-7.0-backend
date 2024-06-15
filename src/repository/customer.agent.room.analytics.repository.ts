import { CustomerAgentRoomAnalytic } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const createAgentRoomAnalytic = async (customerAgentRoomAnalytics: CustomerAgentRoomAnalytic) => {
    const result = await prisma.customerAgentRoomAnalytic.create({
        data: { ...customerAgentRoomAnalytics },
        select: {
            id: true,
            roomChatsSummary: true,
            customerSatisfactionScore: true,
            customerAgentRoomId: true,
            customerAgentRoom: true
        }
    })

    return result
}

export const getCustomerAgentRoomAnalyticsByMonth = async (startDate: Date, endDate: Date) => {
    const result = await prisma.customerAgentRoom.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            customerAgentRoomAnalytic: true
        }
    })

    var averageCustomerSatisfaction: number = 0

    result.map((res) => {
        if (res.customerAgentRoomAnalytic !== null) {
            averageCustomerSatisfaction += res.customerAgentRoomAnalytic.customerSatisfactionScore === -1 ? 0 : res.customerAgentRoomAnalytic.customerSatisfactionScore
        }
    })

    return averageCustomerSatisfaction / result.length
} 