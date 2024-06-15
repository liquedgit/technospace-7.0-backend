import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import agentRouter from "./agent.route"
import customerAIChatRouter from "./customer.ai.chat.route";
import agentAIChatRouter from "./agent.ai.chat.route";
import customerAIRoomRouter from "./customer.ai.room.route";
import AgentAIRoomRouter from "./agent.ai.room.route";
import customerAgentRoomRouter from "./customer.agent.room.route";
import emailRouter from "./email.route";
import LiveCallRouter from "./live.call.route"

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/chats", customerAIChatRouter);
router.use("/chats", agentAIChatRouter);
router.use("/rooms", customerAIRoomRouter);
router.use("/rooms", AgentAIRoomRouter);
router.use("/rooms", customerAgentRoomRouter);
router.use("/live-call", LiveCallRouter)
router.use("/agents", agentRouter)
router.use("/emails", emailRouter)

export default router;
