import express, { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { upload } from "../../middleware/upload.js";
import { createSpeciesSchema, updateSpeciesSchema, listSpeciesQuerySchema } from "./species.schema.js";
import * as speciesController from "./species.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", validateQuery(listSpeciesQuerySchema), speciesController.list);
router.get("/:id", speciesController.getById);
router.post("/", validateBody(createSpeciesSchema), speciesController.create);
router.post("/import", upload.single("file"), speciesController.importFromFile);
router.put("/:id", validateBody(updateSpeciesSchema), speciesController.update);
router.delete("/:id", speciesController.remove);

export const speciesRouter: express.Router = router;
