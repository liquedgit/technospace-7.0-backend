import { Request, Response } from "express"
import { RegisterRequestDto } from "../dto/register.request.dto"
import { User } from "@prisma/client"
import { hash } from "bcrypt"
import {v4 as uuidv4} from "uuid"

export const CreateNewAgent =  async(req: Request, res : Response)=>{
    const reqBody : RegisterRequestDto = req.body
    const bcryptSecret = process.env.BCRYPT_SECTET || "SECRET"
    const hashedPassword = await hash(reqBody.password, bcryptSecret)
    const newUser : User = {
        createdAt : new Date(),
        email : reqBody.email,
        name : reqBody.name,
        password : hashedPassword,
        id: uuidv4(),
        profilePicture : "",
        roleId : "tes"
    }
}