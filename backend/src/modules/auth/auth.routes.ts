import express, { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);

export const authRouter: express.Router = router;
