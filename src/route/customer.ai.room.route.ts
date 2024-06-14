import * as customerAIRoomController from '../controller/customer.ai.room.controller';
import { Router } from "express"
import { bodyEmailValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/customer-ai",
    bodyEmailValidation(["customerEmail", "customerName"]),
    errorValidator,
    customerAIRoomController.createCustomerAIRoom
)

export default router;