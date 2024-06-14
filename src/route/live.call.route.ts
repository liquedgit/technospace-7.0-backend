import { Router } from "express";
import { bodyEmailValidation, bodyEmptyValidation } from "../middleware/validator.middleware";
import { AddLiveCallQueueController, DeleteLiveCallQueueController, GetLiveCallQueueController } from "../controller/live.call.queue.controller";
import { GetAllLiveQueue } from "../repository/live.call.repository";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.post("/queue", bodyEmptyValidation(["name", "email", "peerId"]), bodyEmailValidation(["email"]), AddLiveCallQueueController)
router.get("/queue", GetLiveCallQueueController)
router.delete("/queue", isAuthenticated, DeleteLiveCallQueueController)
export default router