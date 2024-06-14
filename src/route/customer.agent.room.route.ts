import * as customerAgentRoomController from '../controller/customer.agent.room.controller';
import { Router } from "express"
import { bodyEmailValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.post(
    "/customer-ai",
    bodyEmailValidation(["customerEmail", "customerName"]),
    errorValidator,
    customerAgentRoomController.createCustomerAgentRoom
)

export default router;