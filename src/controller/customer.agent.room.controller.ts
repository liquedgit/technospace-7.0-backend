import { Request, Response } from "express";
import { createRoom as cRoom, getRoomByState, acceptCustomerAgent as accCustomerAgent, markFinishedCustomerAgent as markFinish, getAllRoomByState, getRoomById } from "../repository/customer.agent.room.repository";
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from "../dto/response.dto";
import { CreateCustomerAgentRoomRequestDto } from "../dto/create.customer.agent.room.request.dto";
import { finishedCustomerAgentRoomState, onGoingCustomerAgentRoomState, openAIApiKey, pendingCustomerAgentRoomState } from "../util/constant";
import { CreateCustomerAgentRoomResponseDto } from "../dto/create.customer.agent.room.response.dto";
import { CustomerAgentRoomResponseDto } from "../dto/customer.agent.room.response.dto";
import { AcceptCustomerAgentRequestDto } from "../dto/accept.customer.agent.request.dto";
import { MarkFinishedCustomerAgentRequestDto } from "../dto/mark.finished.customer.agent.request.dto";
import OpenAI from "openai";
import { createAgentRoomAnalytic } from "../repository/customer.agent.room.analytics.repository";

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

        const pageNumber = req.query.pageNumber?.toString() || 1
        const perPage = req.query.perPage?.toString() || 10
        let numberPage: number = 0
        let numberPerPage: number = 0
        if (typeof perPage == "string" && !isNaN(parseInt(perPage))) {
            numberPerPage = parseInt(perPage);
        } else if (typeof perPage == "number") {
            numberPerPage = perPage
        }
        if (typeof pageNumber == "string" && !isNaN(parseInt(pageNumber))) {
            numberPage = parseInt(pageNumber);
        } else if (typeof pageNumber == "number") {
            numberPage = pageNumber
        }


        const result = await getRoomByState(pendingCustomerAgentRoomState, null, numberPage, numberPerPage);

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

        const allRoom = await getAllRoomByState(pendingCustomerAgentRoomState, null)

        const responseDto: ResponseDto<CustomerAgentRoomResponseDto[]> = {
            data: customerAgentResponseDtos,
            totalCount: allRoom.length
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

        const pageNumber = req.query.pageNumber?.toString() || 1
        const perPage = req.query.perPage?.toString() || 10
        let numberPage: number = 0
        let numberPerPage: number = 0
        if (typeof perPage == "string" && !isNaN(parseInt(perPage))) {
            numberPerPage = parseInt(perPage);
        } else if (typeof perPage == "number") {
            numberPerPage = perPage
        }
        if (typeof pageNumber == "string" && !isNaN(parseInt(pageNumber))) {
            numberPage = parseInt(pageNumber);
        } else if (typeof pageNumber == "number") {
            numberPage = pageNumber
        }


        const result = await getRoomByState(onGoingCustomerAgentRoomState, agentId, numberPage, numberPerPage);

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

        const responseDto: ResponseDto<CustomerAgentRoomResponseDto[]> = {
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

        const pageNumber = req.query.pageNumber?.toString() || 1
        const perPage = req.query.perPage?.toString() || 10
        let numberPage: number = 0
        let numberPerPage: number = 0
        if (typeof perPage == "string" && !isNaN(parseInt(perPage))) {
            numberPerPage = parseInt(perPage);
        } else if (typeof perPage == "number") {
            numberPerPage = perPage
        }
        if (typeof pageNumber == "string" && !isNaN(parseInt(pageNumber))) {
            numberPage = parseInt(pageNumber);
        } else if (typeof pageNumber == "number") {
            numberPage = pageNumber
        }

        const result = await getRoomByState(finishedCustomerAgentRoomState, agentId, numberPage, numberPerPage);

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

        const responseDto: ResponseDto<CustomerAgentRoomResponseDto[]> = {
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

async function analyzeChat(transcript: string) {
    const prompt = `
    Analyze the following customer service chat transcript and provide a summary of the conversation and a customer satisfaction score between 0 and 10. If there isn't enough information to determine the satisfaction score, return -1.

    Transcript:${transcript}

    Provide the response in the following JSON format:
    {
        "roomChatsSummary": "...",
        "customerSatisfactionScore": ...
    }
    `;

    try {

        const openai = new OpenAI({
            apiKey: openAIApiKey
        });

        const response = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You are an assistant that analyzes customer service chat transcripts."
            },
            {
                "role": "user",
                "content": prompt,
            }],
            model: "gpt-3.5-turbo",
        });

        console.log(response.choices[0])

        return JSON.parse(String(response.choices[0].message.content));
    } catch (error) {
        console.error('Error analyzing chat:', error);
        throw error;
    }
}

export const markFinishCustomerAgent = async (req: Request, res: Response) => {

    try {
        const reqBody: MarkFinishedCustomerAgentRequestDto = req.body

        const isSuccess = await markFinish(reqBody.customerAgentRoomId)

        if (isSuccess) {
            const webResponseDTO: ResponseDto<null> = {
                data: null
            }


            const room = await getRoomById(reqBody.customerAgentRoomId)

            var transcript = ""
            room?.customerAgentChats.map((chat, index) => {
                if (chat.agent !== null) {
                    transcript = transcript + "\n" + chat.agent.name + ": " + chat.messageText
                } else {
                    transcript = transcript + "\n" + chat.name + ": " + chat.messageText
                }
            })

            console.log("Transcript: ", transcript)

            const jsonAnalytics = await analyzeChat(transcript)

            console.log("Analytics: ", jsonAnalytics)

            const roomAnalytics = await createAgentRoomAnalytic({
                customerAgentRoomId: reqBody.customerAgentRoomId,
                customerSatisfactionScore: jsonAnalytics["customerSatisfactionScore"],
                roomChatsSummary: jsonAnalytics["roomChatsSummary"],
                id: uuidv4()
            })

            return res.status(200).json(roomAnalytics)
        }
        return res.status(400).json({ errors: ["Mark finish customer agent room failed"] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}
