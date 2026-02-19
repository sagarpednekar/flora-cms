import { Router } from "express";
import { authenticate, requireRole } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { createRoleSchema, updateRoleSchema } from "./roles.schema.js";
import * as rolesController from "./roles.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", rolesController.list);
router.get("/:id", rolesController.getById);
router.post("/", requireRole("Super Admin"), validateBody(createRoleSchema), rolesController.create);
router.put("/:id", requireRole("Super Admin"), validateBody(updateRoleSchema), rolesController.update);
router.delete("/:id", requireRole("Super Admin"), rolesController.remove);

export const rolesRouter = router;
