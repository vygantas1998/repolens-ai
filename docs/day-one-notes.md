# Day One Notes

## Decision

The first project is **RepoLens AI**, an AI Codebase Visualizer.

## Why This Project

- It is a developer power tool, not a boring admin app.
- It can look visually impressive with a graph/canvas UI.
- It fits existing full-stack experience.
- It demonstrates practical AI engineering.
- It can become a portfolio project, browser extension, or SaaS.

## First MVP

Paste file tree -> analyze -> show visual architecture map and AI summary.

## Day 2-3 Result

Completed a working TypeScript MVP:

- Node.js + Express backend.
- React + TypeScript frontend.
- Shared analysis types.
- `POST /api/analyze-tree` endpoint.
- Deterministic fallback analyzer.
- Visual map and result cards.
- Passing typecheck and production build.

## Quality Setup Added

- ESLint flat config for TypeScript, React hooks, server, and client code.
- Vitest for server unit/API tests.
- Vitest + Testing Library for React component and app tests.
- 100% coverage thresholds for current source code.
- Passing lint, typecheck, coverage, and build commands.

## UI Setup Added

- Tailwind CSS.
- shadcn-compatible `components.json`.
- Local shadcn-style UI primitives for button, card, badge, and textarea.
- Dark developer-tool UI converted from custom CSS classes to Tailwind utilities.

## Agent Notes

The `.agents` folder currently contains an `ai-sdk` skill. Use it when adding real AI SDK features later, especially structured output, tool calling, streaming, or agent workflows.

## Next Task

Improve the architecture canvas workflow:

- Linked file tree in the inspector.
- Better selected-node file grouping.
- Important file callouts.
- Optional experimental 3D city view later.

## Open Questions For Later

- Should the visual map use React Flow or custom cards first?
- Should the first public demo use fake data or a real open-source repo?
- Which LLM API will be used locally?
- Should GitHub URL import happen in week two or week three?
