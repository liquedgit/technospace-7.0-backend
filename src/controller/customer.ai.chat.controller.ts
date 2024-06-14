import { Request, Response } from "express";
import OpenAI from "openai"
import { aiChatBotName, openAIApiKey } from "../util/constant"
import { v4 as uuidv4 } from 'uuid';
import { createChat } from "../repository/customer.ai.chat.repository"
import { ResponseDto } from "../dto/response.dto";
import { CreateCustomerAIChatRequestDto } from "../dto/create.customer.ai.chat.request.dto";
import { CreateCustomerAIChatResponseDto } from "../dto/create.customer.ai.chat.response.dto";

export const createCustomerAIChat = async (req: Request, res: Response) => {
    try {
        const reqBody: CreateCustomerAIChatRequestDto = req.body;
        await createChat({
            id: uuidv4(),
            customerAIRoomId: reqBody.roomId,
            name: reqBody.customerName,
            messageText: reqBody.message,
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
            customerAIRoomId: reqBody.roomId,
            name: aiChatBotName,
            messageText: String(completion.choices[0]),
            createdAt: new Date(Date.now())
        })

        const responseDto: ResponseDto<CreateCustomerAIChatResponseDto> = {
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
