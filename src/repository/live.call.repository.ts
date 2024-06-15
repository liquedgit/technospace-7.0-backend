import { LiveCallQueue } from "@prisma/client";
import DBClient from "../../prisma/prisma.client";
import {v4 as uuidv4} from "uuid"
const prisma = DBClient.getInstance().prisma;

export const CreateLiveCallQueue = async(name : string, email : string, peerId : string)=>{
    const queueObject : LiveCallQueue = {
        createdAt : new Date(),
        customerEmail : email,
        customerName : name,
        peerJsID : peerId,
        id : uuidv4()
    }
    const liveCallQueue = await prisma.liveCallQueue.create({
        data: queueObject
    })
    return liveCallQueue
}

export const UpdateLiveCallQueueRepository = async(email : string,newPeerId : string)=>{
    const newQueues = await prisma.liveCallQueue.update({
        where:{
            customerEmail : email
        },
        data:{
            peerJsID: newPeerId
        }
    })
    return newQueues
}

export const  GetAllLiveQueue =  async()=>{
    const queues = await prisma.liveCallQueue.findMany()
    return queues
}

export const GetLiveQueueByEmail = async(email : string)=>{
    const queues = await prisma.liveCallQueue.findMany({
        where:{
            customerEmail : email
        }
    })
    return queues
}

export const DeleteLiveQueueRepository = async(email : string, name : string, peerId : string)=>{
    const deletedQueue =  await prisma.liveCallQueue.delete({
        where:{
            customerEmail : email,
            AND : {
                customerName : name,
                AND : {
                    peerJsID : peerId
                }
            }
        }
    })
    return deletedQueue
}

export const AddHistoryLiveCallRepository = async(deletedQueue:LiveCallQueue, agentId : string)=>{
    const addedHistoryLiveCall = await prisma.historyLiveCall.create({
        data:{
            customerEmail: deletedQueue.customerEmail,
            customerName : deletedQueue.customerName,
            id : uuidv4(),
            agentId: agentId
        }
    })
    return addedHistoryLiveCall
}

export const GetAllHistoryLiveCallRepository = async()=>{
    const historyLiveCalls = await prisma.historyLiveCall.findMany()
    return historyLiveCalls
}

export const GetHistoryLiveCallByIdRepository = async(id : string)=>{
    const historyLiveCall = await prisma.historyLiveCall.findFirst({
        where:{
            id : id
        }
    })
    return historyLiveCall
}