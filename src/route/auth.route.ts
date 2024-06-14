import { Router } from "express";
import * as userController from '../controller/auth.controller';
import { bodyEmailValidation, bodyEmptyValidation, errorValidator } from "../middleware/validator.middleware";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.post(
    "/login",
    bodyEmptyValidation(["email", "password"]),
    bodyEmailValidation(["email"]),
    errorValidator,
    userController.login
)

router.put(
    "/update-password",
    isAuthenticated,
    bodyEmptyValidation(["currentPassword", "newPassword"]),
    errorValidator,
    userController.updatePassword
)

export default router;