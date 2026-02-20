import express, { Router } from "express";
import { authenticate, requireRole } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { patchSettingsSchema } from "./settings.schema.js";
import * as settingsController from "./settings.controller.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("Super Admin"));

router.get("/", settingsController.get);
router.patch("/", validateBody(patchSettingsSchema), settingsController.patch);

export const settingsRouter: express.Router = router;
