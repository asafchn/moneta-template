# Moneta landing page

A static React + TypeScript app, built with Vite and MUI. No backend, credentials, analytics, or live repository access. All knowledge shown is illustrative.

## Run locally

Use Node.js 22.12+ (or a current supported version).

```sh
cd site
npm ci
npm run dev
```

Open http://127.0.0.1:5173. `npm run build` type-checks and creates `dist/`.

## Deploy to Vercel

Import `asafchn/moneta-template`, set **Root Directory** to `site`, and use the **Vite** preset. The included `vercel.json` specifies `npm ci`, `npm run build`, and output `dist`. No environment variables required. The page uses anchor navigation, so no SPA rewrite is needed.

## Design

An editorial field notebook: warm paper, forest ink, restrained rust highlights, Newsreader headings and DM Sans controls. Fonts are served locally. MUI provides the theme, buttons, tabs, inputs, chips and feedback. Canvas draws the graph; equivalent HTML buttons support keyboard exploration. Graph nodes float gently, paired dots travel along connections, and the selected node pulses. Motion pauses offscreen and can be paused manually. Reduced motion starts still with an explicit Play control; no graph library is needed.

Graph examples and learning stages live in `src/data.ts`. The eight type names and five edge pairs match Moneta's starter collection; node bodies are illustrative. The extension preview is a teaching mock, not a schema generator. Installation commands reflect the private source repository and do not execute in the browser.

## Local graph viewer

The generated runtime's `moneta-show` skill serves its selected memory area on 127.0.0.1. `Viewer.tsx` shares `CanvasGraph` with the landing page. Its server reads the area's local registries and direct Markdown nodes; no provider API calls, graph writes or remote assets. Production refresh applies the shared one-hour Git pull rule to the reviewed clone before reading; candidates keep their separate frozen checkout. Search is a UI filter, separate from the agent's knowledge-search skill. The inspector shows Markdown as text, without executing embedded HTML. Limits: 2,000 nodes and 1 MiB per file; larger inputs are rejected rather than silently truncated.

After changing the viewer or `tools/moneta-show-server.cjs`, run `npm run build:viewer` here, then `python tools/package_plugins.py --reconcile` from the repository root. This builds committed runtime assets and a self-contained Node.js server with bundled YAML parsing and redaction. End users do not install npm dependencies. Run `npm run build` separately for the Vercel landing page.

## Check

```sh
npx playwright install chromium
npm test
```

Browser checks cover canvas selection, keyboard access, learning stages, installation variants, clipboard, extension previews, and mobile overflow. Screenshots are written to the ignored `test-results/` directory.

Implementation references: [MUI installation](https://mui.com/material-ui/getting-started/installation/), [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
