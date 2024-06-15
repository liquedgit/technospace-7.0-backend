import { log } from "console";
import DBClient from "../../prisma/prisma.client";
import { User } from "@prisma/client";
import { adminRole } from "../util/constant";

const prisma = DBClient.getInstance().prisma;


export const GetAgentsRepository = async(pageNumber : number, perPage : number, search : string) =>{
    const skip : number = (pageNumber <= 1) ? 0 : pageNumber * perPage
    const agents = await prisma.user.findMany({
        where:{
            name:{
                contains: search,
                mode: "insensitive"
            },
            AND:{
                role : {
                    name: {
                        not : adminRole
                    }
                }
            }
        },
        skip: skip,
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

export const GetAllAgentsByNameRepository = async(search : string)=>{
    const agents = await prisma.user.findMany({where : {name: {
        contains: search,
        mode : "insensitive"
        
    }, AND:{
        role: {
            name: {
                not : adminRole
            }
        }
    }}})
    return agents
}

