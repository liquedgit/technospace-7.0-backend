import { Router } from "express";
import authRouter from "./auth.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", )

export default router;
