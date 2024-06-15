import { Router } from "express";
import { bodyEmailValidation, bodyEmptyValidation } from "../middleware/validator.middleware";
import { AddLiveCallQueueController, DeleteLiveCallQueueController, GetLiveCallQueueBySocketIOController, GetLiveCallQueueController } from "../controller/live.call.queue.controller";
import { GetAllLiveQueue } from "../repository/live.call.repository";
import { isAuthenticated } from "../middleware/auth.middleware";
import { Namespace, Server, Socket } from "socket.io";

const router = Router()

router.post("/queue", bodyEmptyValidation(["name", "email", "peerId"]), bodyEmailValidation(["email"]), AddLiveCallQueueController)
// router.get("/queue", GetLiveCallQueueController)

router.post("/queue/delete", isAuthenticated, DeleteLiveCallQueueController)

export const GetLiveCallQueueBySocketIORoute = async(io : Server)=>{
    const nsp : Namespace = io.of("/live-call/queue")
    nsp.on("connection", (socket: Socket)=>{
        GetLiveCallQueueBySocketIOController(socket, nsp)
    })
}

export default router