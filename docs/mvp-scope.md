# MVP Scope

## Product Promise

RepoLens AI helps a developer understand a repository faster by converting file structure into a visual architecture map and concise AI explanation.

## First User Story

As a developer, I want to paste a file tree from a project so that I can quickly understand the app structure, important folders, likely technologies, and files I should inspect first.

## First Vertical Slice

Input:

- Pasted file tree or array of file paths.

Processing:

- Normalize paths.
- Group by top-level folder.
- Send file list to AI endpoint.
- Ask for structured JSON.

Output:

- Project type.
- Architecture summary.
- Technology tags.
- Folder explanations.
- Important files.
- Suggested first-read files.
- Simple graph/card map.

## Data Shape

Expected backend response:

```json
{
  "projectName": "Unknown project",
  "projectType": "Full-stack web application",
  "summary": "This appears to be a React and Node.js application...",
  "technologies": ["React", "TypeScript", "Node.js"],
  "folders": [
    {
      "path": "src/components",
      "purpose": "Reusable UI components",
      "confidence": "high"
    }
  ],
  "importantFiles": [
    {
      "path": "src/App.tsx",
      "reason": "Likely main frontend application component",
      "confidence": "high"
    }
  ],
  "suggestedEntryPoints": ["package.json", "src/App.tsx", "server/index.ts"],
  "risks": ["Authentication flow is not obvious from file structure alone"]
}
```

## Non-Goals

- No auth in MVP.
- No billing in MVP.
- No private GitHub repository access in MVP.
- No full code semantic search in week one.
- No perfect framework detection.

## Day 2 Build Target

Create backend endpoint:

`POST /api/analyze-tree`

Request:

```json
{
  "files": ["src/App.tsx", "src/components/Header.tsx", "server/index.ts"]
}
```

Response:

Structured JSON matching the expected backend response shape.
