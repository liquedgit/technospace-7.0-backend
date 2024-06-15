import * as customerAgentRoomController from '../controller/customer.agent.room.controller';
import * as customerAgentRoomAnalyticsController from '../controller/customer.agent.room.analytics.controller';
import { Router } from "express"
import { bodyEmptyValidation, errorValidator } from '../middleware/validator.middleware';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router()

router.post(
    "/customer-agent",
    bodyEmptyValidation(["customerEmail", "customerName"]),
    errorValidator,
    customerAgentRoomController.createCustomerAgentRoom
)

router.get(
    "/customer-agent/pending",
    customerAgentRoomController.getAllPendingRoom
)

router.get(
    "/customer-agent/ongoing/:agentId",
    customerAgentRoomController.getAllOnGoingRoom
)

router.get(
    "/customer-agent/finished/:agentId",
    customerAgentRoomController.getAllFinishedRoom
)

router.put(
    "/customer-agent/accept",
    isAuthenticated,
    bodyEmptyValidation(["customerAgentRoomId"]),
    errorValidator,
    customerAgentRoomController.acceptCustomerAgent
)

router.put(
    "/customer-agent/finish",
    isAuthenticated,
    bodyEmptyValidation(["customerAgentRoomId"]),
    errorValidator,
    customerAgentRoomController.markFinishCustomerAgent
)

router.get("/customer-agent/analytics",
    customerAgentRoomAnalyticsController.getCustomerAgentRoomAnalyticsByMonth
)

export default router;