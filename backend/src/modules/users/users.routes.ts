import express, { Router } from "express";
import { authenticate, requireRole } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { createUserSchema, updateUserSchema, listUsersQuerySchema } from "./users.schema.js";
import * as usersController from "./users.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", validateQuery(listUsersQuerySchema), usersController.list);
router.get("/:id", usersController.getById);
router.post("/", requireRole("Super Admin"), validateBody(createUserSchema), usersController.create);
router.put("/:id", requireRole("Super Admin"), validateBody(updateUserSchema), usersController.update);
router.delete("/:id", requireRole("Super Admin"), usersController.remove);

export const usersRouter: express.Router = router;
