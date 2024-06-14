import { Router } from "express";
import { CreateNewAgent } from "../controller/user.controller";
import { bodyEmptyValidation, errorValidator } from "../middleware/validator.middleware";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.post("/", isAuthenticated,bodyEmptyValidation(["email", "password"]), errorValidator,CreateNewAgent)

export default router