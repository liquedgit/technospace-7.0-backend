import { Request, Response } from "express";
import OpenAI from "openai"
import { aiChatBotName, openAIApiKey } from "../util/constant"
import { v4 as uuidv4 } from 'uuid';
import { createChat } from "../repository/agent.ai.chat.repository"
import { ResponseDto } from "../dto/response.dto";
import { CreateAgentAIChatRequestDto } from "../dto/create.agent.ai.chat.request.dto";
import { CreateAgentAIChatResponseDto } from "../dto/create.agent.ai.chat.response.dto";

export const createAgentAIChat = async (req: Request, res: Response) => {
    try {
        const reqBody: CreateAgentAIChatRequestDto = req.body;
        await createChat({
            id: uuidv4(),
            agentAIRoomId: reqBody.roomId,
            messageText: reqBody.message,
            agentId: reqBody.agentId,
            name: null,
            createdAt: new Date(Date.now())
        })

        const openai = new OpenAI({
            apiKey: openAIApiKey
        });

        const completion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You are a good and nice assistant",
            },
            {
                "role": "user",
                "content": reqBody.message,
            }],
            model: "gpt-3.5-turbo",
        });

        await createChat({
            id: uuidv4(),
            agentAIRoomId: reqBody.roomId,
            name: aiChatBotName,
            agentId: null,
            messageText: String(completion.choices[0]),
            createdAt: new Date(Date.now())
        })

        const responseDto: ResponseDto<CreateAgentAIChatResponseDto> = {
            data: {
                message: String(completion.choices[0])
            }
        }

        return res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}