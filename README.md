# RepoLens AI

RepoLens AI turns a pasted repository file tree into an interactive visual architecture map with deterministic onboarding signals.

## Problem

Understanding an unfamiliar codebase is slow.

Developers usually need to inspect folders, open many files, search for entry points, guess architecture, and ask other developers where important logic lives. This is especially painful when joining a new project, reviewing a legacy app, or returning to an old repo after months away.

## Solution

RepoLens AI helps developers understand a repository faster by combining:

- File tree analysis.
- Deterministic architecture summaries.
- Important folder and file detection.
- A visual map of the codebase.
- A linked file-tree inspector for exploring selected architecture areas.

The first MVP starts simple: paste a file tree, analyze it locally on the backend, and show a visual architecture overview without API keys.

## Target User

- Developers joining an unfamiliar project.
- Freelancers reviewing a client codebase.
- Team leads onboarding new engineers.
- Solo developers returning to old projects.
- Recruiters or reviewers looking at portfolio repositories.

## MVP Scope

The first version should do one thing well:

> Convert a pasted file tree into a useful visual and written explanation of the project structure.

### In Scope For MVP

- Paste file tree input.
- Send file paths to backend.
- Use deterministic heuristics to classify the project structure.
- Return structured JSON.
- Display:
  - Project type.
  - Detected technologies.
  - Important folders.
  - Important files.
  - Architecture summary.
  - Simple visual map.
  - Linked file tree for selected architecture nodes.

### Out Of Scope For MVP

- GitHub OAuth.
- Private repository access.
- Perfect language/framework detection.
- Full source-code embeddings.
- Multi-user accounts.
- Billing.
- Generic chatbot behavior.
- Real LLM explanations.

## Planned Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | Strong portfolio fit and familiar stack |
| Styling | Tailwind CSS + shadcn-style components | Modern UI system with portfolio polish |
| Visual map | Custom shadcn-style cards | Visual portfolio impact without extra complexity |
| Backend | Node.js + Express + TypeScript | Simple analysis API |
| AI | Deterministic local analyzer first, LLM later | Demo works without API keys |
| Database | None for MVP | Add persistence later |

## Current MVP Status

Completed:

- React + TypeScript frontend.
- Node.js + Express + TypeScript backend.
- `POST /api/analyze-tree` endpoint.
- Shared TypeScript analysis types.
- Tailwind CSS setup.
- shadcn-compatible `components.json` and local UI primitives.
- ESLint setup for TypeScript and React.
- Vitest setup for server and client.
- 100% coverage thresholds for current source code.
- File tree text input.
- Deterministic stack/folder/file analysis.
- Visual architecture map using clickable cards.
- Summary, technology tags, important files, entry points, and risks.
- Linked file-tree inspector for selected architecture nodes.
- Focused component structure with dedicated canvas, briefing, repository tree, and inspector card components.

Not built yet:

- Real LLM API integration.
- GitHub URL import.
- ZIP upload.
- Saved analyses.

## Running Locally

Install dependencies:

```bash
npm install
```

Start backend and frontend together:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:4000
```

Run TypeScript checks:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Run coverage with 100% thresholds:

```bash
npm run coverage
```

Build production assets:

```bash
npm run build
```

## Quality Standard

The project currently requires these checks to pass:

- `npm run lint`
- `npm run typecheck`
- `npm run coverage`
- `npm run build`

Coverage thresholds are set to 100% for statements, branches, functions, and lines for the current source code. Test files, build output, and app entry-point bootstrapping are excluded from coverage.

## Analyzer Semantics

The current backend analyzes file paths only. It does not read source contents yet.

- `graph.nodes[*].files` contains every visible file that belongs to that node.
- Root-level files such as `README.md` and `package.json` belong to the `Repository` node.
- Folder files such as `src/App.tsx` belong to the matching top-level folder node.
- `importantFiles` is different from node files: it is a curated shortlist of files that are likely useful starting points.
- `importantFiles` is capped at 8 to keep the briefing readable.
- `suggestedEntryPoints` is derived from the first 5 `importantFiles`.

This means a node can show 20 files while `importantFiles` shows fewer. That is expected: node files are exhaustive for the pasted tree, while important files are highlighted recommendations.

## Demo Flow

1. User opens RepoLens AI.
2. User pastes a file tree from a repository.
3. User clicks `Analyze Codebase`.
4. Backend analyzes the file structure and returns structured architecture data.
5. App displays:
   - Architecture summary.
   - Tech tags.
   - Important folders and files.
   - Visual map.
6. User selects architecture nodes to inspect linked files and important file callouts.

## Example Questions

- What does this project appear to do?
- Which files should a new developer read first?
- What architecture risks do you see from this structure?
- What documentation should be added first?
- Which highlighted files should a new developer open first?

## Week One Goal

By the end of week one, RepoLens AI should be able to analyze a pasted sample file tree and display a visually clear codebase overview.

Success means the demo is useful and understandable, not perfect.

## Future Roadmap

### Phase 1 - Local MVP

- Paste file tree.
- Generate deterministic structured architecture summary.
- Display visual folder/file map.
- Inspect selected architecture nodes through a linked file tree.

### Phase 2 - Real Repository Input

- Upload zip.
- Import public GitHub repository by URL.
- Read selected source files, not only paths.
- Generate better architecture reports.

### Phase 3 - Portfolio Product

- Save analyses.
- Export Markdown documentation.
- Share public read-only reports.
- Add polished landing page.

### Phase 4 - SaaS Direction

- GitHub integration.
- Team workspaces.
- PR impact analysis.
- Onboarding reports for new developers.
- Browser extension for GitHub pages.

## Positioning

RepoLens AI is not a generic chatbot.

It is a developer power tool for turning messy repository structure into understandable architecture.
