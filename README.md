# RepoLens AI

RepoLens AI turns a codebase into an interactive visual architecture map with AI explanations.

## Problem

Understanding an unfamiliar codebase is slow.

Developers usually need to inspect folders, open many files, search for entry points, guess architecture, and ask other developers where important logic lives. This is especially painful when joining a new project, reviewing a legacy app, or returning to an old repo after months away.

## Solution

RepoLens AI helps developers understand a repository faster by combining:

- File tree analysis.
- AI-generated architecture summaries.
- Important folder and file detection.
- A visual map of the codebase.
- Focused questions like "Where is authentication likely handled?" or "Which files should I read first?"

The first MVP starts simple: paste a file tree, analyze it, and show a visual architecture overview.

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
- Ask an LLM to classify the project structure.
- Return structured JSON.
- Display:
  - Project type.
  - Detected technologies.
  - Important folders.
  - Important files.
  - Architecture summary.
  - Simple visual map.
- Ask focused questions about the analyzed structure.

### Out Of Scope For MVP

- GitHub OAuth.
- Private repository access.
- Perfect language/framework detection.
- Full source-code embeddings.
- Multi-user accounts.
- Billing.
- Generic chatbot behavior.

## Planned Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | Strong portfolio fit and familiar stack |
| Styling | Tailwind CSS + shadcn-style components | Modern UI system with portfolio polish |
| Visual map | Custom shadcn-style cards | Visual portfolio impact without extra complexity |
| Backend | Node.js + Express + TypeScript | Simple AI API integration |
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

Not built yet:

- Real LLM API integration.
- Focused question endpoint.
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

## Demo Flow

1. User opens RepoLens AI.
2. User pastes a file tree from a repository.
3. User clicks `Analyze Codebase`.
4. Backend sends the file structure to an LLM with a structured-output prompt.
5. App displays:
   - Architecture summary.
   - Tech tags.
   - Important folders and files.
   - Visual map.
6. User asks a focused question about the codebase.
7. App answers using the analyzed structure and references likely relevant files.

## Example Questions

- What does this project appear to do?
- Which files should a new developer read first?
- Where is authentication likely handled?
- Where are API routes likely defined?
- What architecture risks do you see from this structure?
- What documentation should be added first?

## Week One Goal

By the end of week one, RepoLens AI should be able to analyze a pasted sample file tree and display a visually clear codebase overview.

Success means the demo is useful and understandable, not perfect.

## Future Roadmap

### Phase 1 - Local MVP

- Paste file tree.
- Generate structured architecture summary.
- Display visual folder/file map.
- Ask focused questions.

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
