import * as emailController from '../controller/email.controller';
import { Router } from "express"
import { bodyEmptyValidation, errorValidator } from '../middleware/validator.middleware';

const router = Router()

router.get(
    "/",
    emailController.GetEmail
)

router.post(
    "/reply",
    bodyEmptyValidation(["emailId", "email", "message"]),
    errorValidator,
    emailController.ReplyEmail
)

export default router;