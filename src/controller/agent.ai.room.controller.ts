import { Request, Response } from "express";
import { createRoom as cRoom } from "../repository/agent.ai.room.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { CreateAgentAIRoomResponseDto } from "../dto/create.agent.ai.room.response.dto";
import { CreateAgentAIRoomRequestDto } from "../dto/create.agent.ai.room.request.dto";

export const createAgentAIRoom = async (req: Request, res: Response) => {
    try {
        const reqBody: CreateAgentAIRoomRequestDto = req.body
        const room = await cRoom({
            id: uuidv4(),
            createdAt: new Date(Date.now()),
            agentId: reqBody.agentId
        })

        const responseDto: ResponseDto<CreateAgentAIRoomResponseDto> = {
            data: {
                roomId: room.id,
                createdAt: room.createdAt,
                agentId: reqBody.agentId
            }
        }
        return res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}