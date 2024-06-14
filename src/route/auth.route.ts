import { Router } from "express";
import * as userController from '../controller/auth.controller';
import { bodyEmailValidation, bodyEmptyValidation, errorValidator } from "../middleware/validator.middleware";

const router = Router()

router.post(
    "/login",
    bodyEmptyValidation(["email", "password"]),
    bodyEmailValidation(["email"]),
    errorValidator,
    userController.login
)

export default router;