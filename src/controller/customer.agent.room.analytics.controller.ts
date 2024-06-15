import { Request, Response } from "express";
import { getCustomerAgentRoomAnalyticsByMonth as getAnalysis } from "../repository/customer.agent.room.analytics.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { MarkFinishedCustomerAgentRequestDto } from "../dto/mark.finished.customer.agent.request.dto";
import { createAgentRoomAnalytic } from "../repository/customer.agent.room.analytics.repository";
import { GetCustomerAgentRoomAnalyticsByMonthRequestDto } from "../dto/get.customer.agent.room.analytics.by.month.request.dto";
import { GetCustomerAgentRoomAnalyticsByMonthResponseDto } from "../dto/get.customer.agent.room.analytics.by.month.response.dto";

export const getCustomerAgentRoomAnalyticsByMonth = async (req: Request, res: Response) => {

    try {
        const reqBody: GetCustomerAgentRoomAnalyticsByMonthRequestDto = req.body

        const result = await getAnalysis(reqBody.startDate, reqBody.endDate)

        const responseDto: ResponseDto<GetCustomerAgentRoomAnalyticsByMonthResponseDto> = {
            data: {
                averageCustomerSatisfaction: result
            }
        }
        res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}