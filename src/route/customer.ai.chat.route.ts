import * as customerAIChatController from '../controller/customer.ai.chat.controller';
import { Router } from "express"
import { bodyEmptyValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/customer-ai",
    bodyEmptyValidation(["roomId", "message", "customerName"]),
    errorValidator,
    customerAIChatController.createCustomerAIChat
)

export default router;