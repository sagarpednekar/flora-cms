import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes.js";
import { speciesRouter } from "./modules/species/species.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { rolesRouter } from "./modules/roles/roles.routes.js";
import { settingsRouter } from "./modules/settings/settings.routes.js";

const app: express.Express = express();
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/species", speciesRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/settings", settingsRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
