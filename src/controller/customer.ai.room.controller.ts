import { Request, Response } from "express";
import { createRoom as cRoom } from "../repository/customer.ai.room.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { CreateCustomerAIRoomResponseDto } from "../dto/create.customer.ai.room.response.dto";
import { CreateCustomerAIRoomRequestDto } from "../dto/create.customer.ai.room.request.dto";

export const createCustomerAIRoom = async (req: Request, res: Response) => {
    try {
        const reqBody: CreateCustomerAIRoomRequestDto = req.body
        const room = await cRoom({
            id: uuidv4(),
            createdAt: new Date(Date.now()),
            customerName: reqBody.customerName,
            customerEmail: reqBody.customerEmail,
        })

        const responseDto: ResponseDto<CreateCustomerAIRoomResponseDto> = {
            data: {
                roomId: room.id,
                createdAt: room.createdAt,
                customerEmail: room.customerEmail,
                customerName: room.customerName
            }
        }
        return res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}