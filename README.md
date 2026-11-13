# Sera

A calm, exact design system for product UI — React + StyleX source you own.

- **166 components** in 13 groups, each with copy-ready StyleX source
- **116 product screens** across 11 kinds of app
- Dark and light from the same tokens, five accent presets

## Repo layout

| Path | What it is |
| --- | --- |
| `index.html`, `sera.css`, `js/` | The docs site (static, no build step) |
| `starter/` | Vite + React 19 + StyleX app with every component in `src/sera/` |
| `create-sera.mjs` | One-file installer that writes the starter |

## Use it

```bash
node create-sera.mjs my-app     # new project
cd my-app && npm install && npm run dev
```

Or copy `starter/src/sera/` into an existing Vite + React app — see the Installation page of the docs.

## Run the docs locally

```bash
npx serve .
```
