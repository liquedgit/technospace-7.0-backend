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
                "content": "Given a customer service query related to Indihome Indonesia in your preferred language, provide a well-informed, accurate, and empathetic response addressing the customer's issue based on Indihome's services, policies, and common troubleshooting steps. Recognize the context and sentiment of the query to provide the most appropriate response.",
            },
            {
                "role": "user",
                "content": reqBody.message,
            }],
            model: `ft:gpt-3.5-turbo-0125:personal::9aIgfTVf`,
        });

        await createChat({
            id: uuidv4(),
            agentAIRoomId: reqBody.roomId,
            name: aiChatBotName,
            agentId: null,
            messageText: String(completion.choices[0].message.content),
            createdAt: new Date(Date.now())
        })

        const responseDto: ResponseDto<CreateAgentAIChatResponseDto> = {
            data: {
                message: String(completion.choices[0].message.content)
            }
        }

        return res.status(200).json(responseDto)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}