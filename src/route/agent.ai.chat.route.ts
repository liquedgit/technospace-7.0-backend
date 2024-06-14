import * as agentAIChatController from '../controller/agent.ai.chat.controller';
import { Router } from "express"
import { bodyEmptyValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/agent-ai",
    bodyEmptyValidation(["roomId", "message", "customerName"]),
    errorValidator,
    agentAIChatController.createAgentAIChat
)

export default router;