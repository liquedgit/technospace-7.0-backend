import { Request, Response } from "express"
import { RegisterRequestDto } from "../dto/register.request.dto"
import { User } from "@prisma/client"
import { hash } from "bcrypt"
import {v4 as uuidv4} from "uuid"
import { GetRoleById, GetRoleByName } from "../repository/role.repository"
import { agentRole } from "../util/constant"
import { CreateUser, getUserByEmail, getUserById } from "../repository/user.repository"
import { ResponseDto } from "../dto/response.dto"
import { RegisterResponseDto } from "../dto/register.response.dto"
import { getRandomValues, randomInt } from "crypto"
import { MeResponseDTO } from "../dto/me.response.dto"

export const CreateNewAgent =  async(req: Request, res : Response)=>{
    try{
        const reqBody : RegisterRequestDto = req.body
        const bcryptSecret = randomInt(10)
        const hashedPassword = await hash(reqBody.password, bcryptSecret)
        const role = await GetRoleByName(agentRole)
        if(role != null){
            const newUser : User = {
                createdAt : new Date(),
                email : reqBody.email,
                name : reqBody.name,
                password : hashedPassword,
                id: uuidv4(),
                profilePicture : "",
                roleId : role.id
            }

            const user = await getUserByEmail(newUser.email)
            if(user != null){
                return res.status(400).json({errors:["Email already exist"]})
            }

            await CreateUser(newUser)
            
            const registerResponse : RegisterResponseDto = {
                id : newUser.id,
                email : newUser.email,
                name : newUser.name,
                createdAt : newUser.createdAt
            }
            const webResponseDTO : ResponseDto<RegisterResponseDto> = {
                data: registerResponse
            }
            return res.status(201).json(webResponseDTO)
        }
        return res.status(500).json({errors:["Internal Server Error"]})
    }catch(error){
        console.log(error)
        return res.status(500).json({errors: ["Internal Server Error"]})
    }
    
}

export const GetAgent = async(req : Request, res : Response)=>{
    try{
        const id = req.jwtPayload.id
        const user = await getUserById(id)
        if(user != null){
            const meResponseDTO : MeResponseDTO = {
                email : user.email,
                id : user.id,
                name : user.name,
                role : user.role.name
            }
            const webResponseDTO : ResponseDto<MeResponseDTO> = {
                data:meResponseDTO
            }
            return res.status(200).json(webResponseDTO)
        }
        return res.status(400).json({errors: ["Internal Server Error"]})
    }catch(error){
        return res.status(500).json({errors: ["internal Server Error"]})
    }
    
}
