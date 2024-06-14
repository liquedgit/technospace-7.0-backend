import { Request, Response } from "express";
import { createRoom as cRoom, getRoomByState, acceptCustomerAgent as accCustomerAgent } from "../repository/customer.agent.room.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { CreateCustomerAgentRoomRequestDto } from "../dto/create.customer.agent.room.request.dto";
import { finishedCustomerAgentRoomState, onGoingCustomerAgentRoomState, pendingCustomerAgentRoomState } from "../util/constant";
import { CreateCustomerAgentRoomResponseDto } from "../dto/create.customer.agent.room.response.dto";
import { CustomerAgentRoomResponseDto } from "../dto/customer.agent.room.response.dto";
import { AcceptCustomerAgentRequestDto } from "../dto/accept.customer.agent.request.dto";

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

export const getAllPendingRoom = async (req: Request, res: Response) => {
    try {
        const result = await getRoomByState(pendingCustomerAgentRoomState, null);

        const customerAgentResponseDtos: CustomerAgentRoomResponseDto[] = result?.map((res) => {
            return {
                roomId: res.id,
                agentId: res.agentId,
                createdAt: res.createdAt,
                customerEmail: res.customerEmail,
                customerName: res.customerName,
                state: res.state
            }
        })

        const responseDto: ResponseDto<CreateCustomerAgentRoomResponseDto[]> = {
            data: customerAgentResponseDtos
        }

        return res.status(200).json(responseDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}

export const getAllOnGoingRoom = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;

        const result = await getRoomByState(onGoingCustomerAgentRoomState, agentId);

        const customerAgentResponseDtos: CustomerAgentRoomResponseDto[] = result?.map((res) => {
            return {
                roomId: res.id,
                agentId: res.agentId,
                createdAt: res.createdAt,
                customerEmail: res.customerEmail,
                customerName: res.customerName,
                state: res.state
            }
        })

        const responseDto: ResponseDto<CreateCustomerAgentRoomResponseDto[]> = {
            data: customerAgentResponseDtos
        }

        return res.status(200).json(responseDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}

export const getAllFinishedRoom = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;

        const result = await getRoomByState(finishedCustomerAgentRoomState, agentId);

        const customerAgentResponseDtos: CustomerAgentRoomResponseDto[] = result?.map((res) => {
            return {
                roomId: res.id,
                agentId: res.agentId,
                createdAt: res.createdAt,
                customerEmail: res.customerEmail,
                customerName: res.customerName,
                state: res.state
            }
        })

        const responseDto: ResponseDto<CreateCustomerAgentRoomResponseDto[]> = {
            data: customerAgentResponseDtos
        }

        return res.status(200).json(responseDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}

export const acceptCustomerAgent = async (req: Request, res: Response) => {
    try {
        const id = req.jwtPayload.id

        const reqBody: AcceptCustomerAgentRequestDto = req.body

        const isSuccess = await accCustomerAgent(reqBody.customerAgentRoomId, id)

        if (isSuccess) {
            const webResponseDTO: ResponseDto<null> = {
                data: null
            }
            return res.status(200).json(webResponseDTO)
        }
        return res.status(400).json({ errors: ["Accept customer failed"] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}