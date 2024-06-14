import { Router } from "express";
import userRouter from "./user.route";
import customerAIChatRouter from "./customer.ai.chat.route";
import agentAIChatRouter from "./agent.ai.chat.route";
import customerAIRoomRouter from "./customer.ai.room.route";
import AgentAIRoomRouter from "./agent.ai.room.route";
import customerAgentRoomRouter from "./customer.agent.room.route";

const router = Router();

router.use("/users", userRouter);
router.use("/chats", customerAIChatRouter);
router.use("/chats", agentAIChatRouter);
router.use("/rooms", customerAIRoomRouter);
router.use("/rooms", AgentAIRoomRouter);
router.use("/rooms", customerAgentRoomRouter);

export default router;
