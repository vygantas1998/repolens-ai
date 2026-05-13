import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("createApp", () => {
  const app = createApp();

  it("returns health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({ ok: true, service: "repolens-ai-server" });
  });

  it("rejects requests without a files array", async () => {
    const response = await request(app).post("/api/analyze-tree").send({ files: "src/App.tsx" }).expect(400);

    expect(response.body).toEqual({
      error: { code: "INVALID_FILES", message: "Expected body.files to be an array of file paths." }
    });
  });

  it("rejects non-string file paths", async () => {
    const response = await request(app)
      .post("/api/analyze-tree")
      .send({ files: ["src/App.tsx", 123] })
      .expect(400);

    expect(response.body).toEqual({
      error: { code: "INVALID_FILE_PATH", message: "Every file path must be a string." }
    });
  });

  it("rejects empty file arrays after trimming", async () => {
    const response = await request(app).post("/api/analyze-tree").send({ files: [" ", ""] }).expect(400);

    expect(response.body).toEqual({
      error: { code: "EMPTY_FILE_TREE", message: "Provide at least one file path to analyze." }
    });
  });

  it("returns analysis for valid file arrays", async () => {
    const response = await request(app)
      .post("/api/analyze-tree")
      .send({ files: ["package.json", "src/App.tsx", "server/index.ts"] })
      .expect(200);

    expect(response.body.projectType).toBe("Full-stack web application");
    expect(response.body.technologies).toEqual(["React", "TypeScript", "Node.js"]);
  });
});
