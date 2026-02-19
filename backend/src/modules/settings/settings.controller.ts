import { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import * as settingsService from "./settings.service.js";

export async function get(_req: AuthRequest, res: Response) {
  const settings = await settingsService.getSettings();
  res.json(settings);
}

export async function patch(req: AuthRequest, res: Response) {
  const settings = await settingsService.patchSettings(req.body);
  res.json(settings);
}
