import { Request, Response } from "express";
import { AddLiveCallQueueRequestDTO, DeleteLiveCallQueueRequestDTO } from "../dto/live.call.request.dto";
import { AddHistoryLiveCallRepository, CreateLiveCallQueue, DeleteLiveQueueRepository, GetAllLiveQueue,GetLiveQueueByEmail, UpdateLiveCallQueueRepository } from "../repository/live.call.repository";
import { ResponseDto } from "../dto/response.dto";
import { HistoryLiveCall, LiveCallQueue } from "@prisma/client";
import { Namespace, Server, Socket } from "socket.io";
import { v4 } from "uuid";

const LIVECALLQUEUEAGENTROOMID = v4()

export const AddLiveCallQueueController = async(req : Request, res: Response)=>{
    try{
        const reqBody : AddLiveCallQueueRequestDTO = req.body

        const currentQueue = await GetLiveQueueByEmail(reqBody.email)
        if(currentQueue.length > 0){
            //Update
            const updatedQueue = await UpdateLiveCallQueueRepository(currentQueue[0].customerEmail, reqBody.peerId)
            const webResponseDTO : ResponseDto<LiveCallQueue>={
                data:updatedQueue
            }
            return res.status(201).json(webResponseDTO)
        }

        const liveCallQueue = await CreateLiveCallQueue(reqBody.name, reqBody.email, reqBody.peerId)

        const webResponseDTO : ResponseDto<LiveCallQueue> = {
            data : liveCallQueue
        }
        return res.status(201).json(webResponseDTO)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors:["Internal Server Error"]})
    }
}

export const GetLiveCallQueueBySocketIOController = async(socket: Socket, nsp : Namespace)=>{
    socket.on("join-room", ()=>{
        console.log("User join room")
        socket.join(LIVECALLQUEUEAGENTROOMID)
    })
    socket.on("join-agent-room", async()=>{
        console.log("Agent join room")
        socket.join(LIVECALLQUEUEAGENTROOMID)
        const queues = await GetAllLiveQueue()
        nsp.to(LIVECALLQUEUEAGENTROOMID).emit("receive-new-queue", queues)
    })

    socket.on("delete-post", async()=>{
        console.log("Data Deleted or changed")
        const queues = await GetAllLiveQueue()
        nsp.to(LIVECALLQUEUEAGENTROOMID).emit("receive-new-queue", queues)
    })

    socket.on("new-queue-added", async()=>{
        console.log("New queue added")
        const queues = await GetAllLiveQueue()
        nsp.to(LIVECALLQUEUEAGENTROOMID).emit("receive-new-queue", queues)
    })
}

export const GetLiveCallQueueController = async(req : Request, res : Response)=>{
    try{
        const queues = await GetAllLiveQueue()
        const webResponse : ResponseDto<LiveCallQueue[]>= {
            data : queues
        }
        return res.status(200).json(webResponse)
    }catch(error){
        return res.status(500).json({errors: ["Internal Server Error"]})
    }
}

export const DeleteLiveCallQueueController = async (req : Request, res : Response)=>{
    try{
        const reqBody : DeleteLiveCallQueueRequestDTO = req.body
        const deletedQueue = await DeleteLiveQueueRepository(reqBody.email)
        const addedHistoryLiveCall = await AddHistoryLiveCallRepository(deletedQueue, req.jwtPayload.id)
        
        const webResponse : ResponseDto<HistoryLiveCall> = {
            data: addedHistoryLiveCall
        }
        return res.status(200).json(webResponse)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors:["Internal Server Error"]})
    }
}
