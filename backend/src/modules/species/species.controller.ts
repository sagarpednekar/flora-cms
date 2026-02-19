import { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import type { ListSpeciesQuery } from "./species.schema.js";
import * as speciesService from "./species.service.js";
import * as importService from "./species.import.service.js";

export async function list(req: AuthRequest, res: Response) {
  const result = await speciesService.list(req.query as unknown as ListSpeciesQuery);
  res.json(result);
}

export async function getById(req: AuthRequest, res: Response) {
  const species = await speciesService.getById(req.params.id);
  if (!species) return res.status(404).json({ error: "Species not found" });
  res.json(species);
}

export async function create(req: AuthRequest, res: Response) {
  const species = await speciesService.create(req.body);
  res.status(201).json(species);
}

export async function update(req: AuthRequest, res: Response) {
  const existing = await speciesService.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Species not found" });
  const species = await speciesService.update(req.params.id, req.body);
  res.json(species);
}

export async function remove(req: AuthRequest, res: Response) {
  const existing = await speciesService.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Species not found" });
  await speciesService.remove(req.params.id);
  res.status(204).send();
}

export async function importFromFile(req: Request, res: Response) {
  const file = req.file as Express.Multer.File | undefined;
  if (!file || !file.buffer) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const result = await importService.importFromBuffer(file.buffer);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Import failed" });
  }
}
