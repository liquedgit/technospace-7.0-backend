import { Router } from "express";
import { CreateNewAgent, GetAgent } from "../controller/user.controller";
import { bodyEmptyValidation, errorValidator } from "../middleware/validator.middleware";
import { IsAdmin, isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.post("/", isAuthenticated,IsAdmin,bodyEmptyValidation(["email", "password"]), errorValidator,CreateNewAgent)
router.get("/", isAuthenticated, GetAgent)
export default router