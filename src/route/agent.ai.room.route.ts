import * as agentAIRoomController from '../controller/agent.ai.room.controller';
import { Router } from "express"
import { bodyEmailValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/customer-ai",
    bodyEmailValidation(["agentId"]),
    errorValidator,
    agentAIRoomController.createAgentAIRoom
)

export default router;