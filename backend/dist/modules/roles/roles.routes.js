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
exports.rolesRouter = void 0;
const express_1 = require("express");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const validate_js_1 = require("../../middleware/validate.js");
const roles_schema_js_1 = require("./roles.schema.js");
const rolesController = __importStar(require("./roles.controller.js"));
const router = (0, express_1.Router)();
router.use(authenticate_js_1.authenticate);
router.get("/", rolesController.list);
router.get("/:id", rolesController.getById);
router.post("/", (0, authenticate_js_1.requireRole)("Super Admin"), (0, validate_js_1.validateBody)(roles_schema_js_1.createRoleSchema), rolesController.create);
router.put("/:id", (0, authenticate_js_1.requireRole)("Super Admin"), (0, validate_js_1.validateBody)(roles_schema_js_1.updateRoleSchema), rolesController.update);
router.delete("/:id", (0, authenticate_js_1.requireRole)("Super Admin"), rolesController.remove);
exports.rolesRouter = router;
//# sourceMappingURL=roles.routes.js.map