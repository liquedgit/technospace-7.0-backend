import { log } from "console";
import DBClient from "../../prisma/prisma.client";
import { User } from "@prisma/client";

const prisma = DBClient.getInstance().prisma;


export const GetAgentsRepository = async(pageNumber : number, perPage : number, search : string) =>{
    const skip : number = (pageNumber <= 1) ? 0 : pageNumber * perPage
    const agents = await prisma.user.findMany({
        where:{
            name:{
                contains: search
            }
        },
        skip: 0,
        take: perPage,
        select:{
            createdAt: true,
            email: true,
            id: true,
            name: true,
            profilePicture: true,
            role: true
        }
    })

    return agents
}