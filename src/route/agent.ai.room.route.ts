import * as agentAIRoomController from '../controller/agent.ai.room.controller';
import { Router } from "express"
import { bodyEmptyValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/customer-ai",
    bodyEmptyValidation(["agentId"]),
    errorValidator,
    agentAIRoomController.createAgentAIRoom
)

export default router;