import { Role } from "@prisma/client";
import DBClient from "../../prisma/prisma.client";

const prisma = DBClient.getInstance().prisma;

export const CreateRole= async(role: Role)=>{
    const newRole = await prisma.role.create({data:role})
    return newRole
}

export const GetRoleById = async(id : string)=>{
    const role = await prisma.role.findUnique({
        where: {id : id},
        select:{
            id: true,
            name : true
        }
    })
    return role
}

export const GetRoleByName = async(name : string)=>{
    const role = await prisma.role.findUnique({
        where: {name : name},
        select: {
            id : true,
            name : true
        }
    })
    return role
}