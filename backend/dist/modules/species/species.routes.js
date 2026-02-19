"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.speciesRouter = void 0;
const express_1 = require("express");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const validate_js_1 = require("../../middleware/validate.js");
const upload_js_1 = require("../../middleware/upload.js");
const species_schema_js_1 = require("./species.schema.js");
const speciesController = __importStar(require("./species.controller.js"));
const router = (0, express_1.Router)();
router.use(authenticate_js_1.authenticate);
router.get("/", (0, validate_js_1.validateQuery)(species_schema_js_1.listSpeciesQuerySchema), speciesController.list);
router.get("/:id", speciesController.getById);
router.post("/", (0, validate_js_1.validateBody)(species_schema_js_1.createSpeciesSchema), speciesController.create);
router.post("/import", upload_js_1.upload.single("file"), speciesController.importFromFile);
router.put("/:id", (0, validate_js_1.validateBody)(species_schema_js_1.updateSpeciesSchema), speciesController.update);
router.delete("/:id", speciesController.remove);
exports.speciesRouter = router;
//# sourceMappingURL=species.routes.js.map