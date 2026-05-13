import cors from "cors";
import express from "express";
import type { AnalyzeTreeRequest, ApiErrorResponse } from "../../shared/analysis.js";
import { analyzeFileTree } from "./services/treeAnalyzer.js";

function badRequest(response: express.Response, code: string, message: string) {
  const body: ApiErrorResponse = { error: { code, message } };

  response.status(400).json(body);
}

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, service: "repolens-ai-server" });
  });

  app.post("/api/analyze-tree", (request, response) => {
    const body = request.body as Partial<AnalyzeTreeRequest>;

    if (!Array.isArray(body.files)) {
      badRequest(response, "INVALID_FILES", "Expected body.files to be an array of file paths.");
      return;
    }

    if (!body.files.every((file) => typeof file === "string")) {
      badRequest(response, "INVALID_FILE_PATH", "Every file path must be a string.");
      return;
    }

    const files = body.files.map((file) => file.trim()).filter(Boolean);

    if (files.length === 0) {
      badRequest(response, "EMPTY_FILE_TREE", "Provide at least one file path to analyze.");
      return;
    }

    response.json(analyzeFileTree(files));
  });

  return app;
}
