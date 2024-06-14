import { Request, Response } from "express"
import { GetAgentsRepository } from "../repository/agent.repository"
import { AgentsResponseDTO } from "../dto/agents.response.dto"
import { ResponseDto } from "../dto/response.dto"

export const GetAgents =  async(req: Request, res : Response)=>{
    try{
        const pageNumber = req.query.pageNumber?.toString() || 1
        const perPage  = req.query.perPage?.toString || 10
        const search = req.query.name?.toString() || ""
        let numberPage : number = 0
        let numberPerPage : number = 0
        if (typeof perPage == "string" && !isNaN(parseInt(perPage))) {
            numberPerPage = parseInt(perPage);
          }else if(typeof perPage == "number"){
            numberPerPage = perPage
          }
          if (typeof pageNumber == "string" && !isNaN(parseInt(pageNumber))) {
            numberPage = parseInt(pageNumber);
          }else if(typeof pageNumber == "number"){
            numberPage = pageNumber
          }

        const agents = await GetAgentsRepository(numberPage, numberPerPage, search)
          const agentsResponseDTO : AgentsResponseDTO = {
            agents : agents.map((agent)=>{
                return {
                    email: agent.email,
                    id : agent.id,
                    name : agent.name,
                    role : agent.role.name
                }
            })
          }
          const webResponseDTO : ResponseDto<AgentsResponseDTO> = {
            data : agentsResponseDTO
          }
        return res.status(200).json(webResponseDTO)

    }catch(error){
        console.error(error)
        return res.status(500).json({errors: ["Internal Server Error"]})
    }
    
    
}