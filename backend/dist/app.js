"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_js_1 = require("./modules/auth/auth.routes.js");
const species_routes_js_1 = require("./modules/species/species.routes.js");
const users_routes_js_1 = require("./modules/users/users.routes.js");
const roles_routes_js_1 = require("./modules/roles/roles.routes.js");
const settings_routes_js_1 = require("./modules/settings/settings.routes.js");
const app = (0, express_1.default)();
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: corsOrigin,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_routes_js_1.authRouter);
app.use("/species", species_routes_js_1.speciesRouter);
app.use("/users", users_routes_js_1.usersRouter);
app.use("/roles", roles_routes_js_1.rolesRouter);
app.use("/settings", settings_routes_js_1.settingsRouter);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
exports.default = app;
//# sourceMappingURL=app.js.map