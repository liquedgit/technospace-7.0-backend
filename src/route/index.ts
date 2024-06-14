import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route"
import agentRouter from "./agent.route"

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/agents", agentRouter)
export default router;
