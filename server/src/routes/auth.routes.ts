import { Router } from "express";
import { register, login, getMe } from "../controller/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);
export default router;
