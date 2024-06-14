import { Router } from "express";
import { IsAdmin, isAuthenticated } from "../middleware/auth.middleware";
import { GetAgents } from "../controller/agent.controller";

const router = Router()

router.get("/", isAuthenticated,IsAdmin, GetAgents)

export default router