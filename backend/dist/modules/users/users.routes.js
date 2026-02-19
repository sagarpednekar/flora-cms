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
exports.usersRouter = void 0;
const express_1 = require("express");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const validate_js_1 = require("../../middleware/validate.js");
const users_schema_js_1 = require("./users.schema.js");
const usersController = __importStar(require("./users.controller.js"));
const router = (0, express_1.Router)();
router.use(authenticate_js_1.authenticate);
router.get("/", (0, validate_js_1.validateQuery)(users_schema_js_1.listUsersQuerySchema), usersController.list);
router.get("/:id", usersController.getById);
router.post("/", (0, authenticate_js_1.requireRole)("Super Admin"), (0, validate_js_1.validateBody)(users_schema_js_1.createUserSchema), usersController.create);
router.put("/:id", (0, authenticate_js_1.requireRole)("Super Admin"), (0, validate_js_1.validateBody)(users_schema_js_1.updateUserSchema), usersController.update);
router.delete("/:id", (0, authenticate_js_1.requireRole)("Super Admin"), usersController.remove);
exports.usersRouter = router;
//# sourceMappingURL=users.routes.js.map