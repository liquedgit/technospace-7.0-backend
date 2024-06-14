import { Router } from "express";
import * as userController from '../controller/user.controller';
import { bodyEmptyValidation, errorValidator } from "../middleware/validator.middleware";

const router = Router()

router.post(
    "/login",
    bodyEmptyValidation(["email", "password"]),
    errorValidator,
    userController.login
)

export default router;