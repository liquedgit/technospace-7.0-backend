import { Request, Response } from "express";
import { createRoom as cRoom } from "../repository/customer.agent.room.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { CreateCustomerAgentRoomRequestDto } from "../dto/create.customer.agent.room.request.dto";
import { pendingCustomerAgentRoomState } from "../util/constant";
import { CreateCustomerAgentRoomResponseDto } from "../dto/create.customer.agent.room.response.dto";

export const createCustomerAgentRoom = async (req: Request, res: Response) => {
    try {
        const reqBody: CreateCustomerAgentRoomRequestDto = req.body
        const room = await cRoom({
            id: uuidv4(),
            customerEmail: reqBody.customerEmail,
            customerName: reqBody.customerName,
            createdAt: new Date(Date.now()),
            agentId: null,
            state: pendingCustomerAgentRoomState,
        })

        const responseDto: ResponseDto<CreateCustomerAgentRoomResponseDto> = {
            data: {
                roomId: room.id,
                state: room.state,
                customerEmail: room.customerEmail,
                customerName: room.customerName,
                agentId: room.agentId,
                createdAt: room.createdAt,
            }
        }
        return res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}