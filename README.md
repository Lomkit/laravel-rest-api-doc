# Laravel Rest Api documentation

Source of [laravel-rest-api.lomkit.com](https://laravel-rest-api.lomkit.com), the documentation of [Laravel Rest Api](https://github.com/Lomkit/laravel-rest-api).

Built with [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and [Nuxt Content](https://content.nuxt.com). The pages live in `content/`: `content/3.x` for the current version, served at the root, and `content/2.x` for the previous one, served under `/2.x`.

## Setup

```bash
npm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
```

## Static build

```bash
npm run generate
```

The site is generated into `.output/public` and deployed to GitHub Pages on every push to `main`.

## Versions and releases

- `shared/utils/versions.ts` lists the documentation versions. A new major adds its folder there and in `content.config.ts`.
- `shared/utils/package-info.ts` holds the facts about the package that `llms.txt` and the structured data of the pages use. Update `release` with each release, and the requirements with `composer.json`.

## Markdown, llms.txt and MCP

The static build publishes `llms.txt`, `llms-full.txt` (current version only) and a Markdown copy of every page under `/raw/<path>.md`.

The deployed site is static and has no `/mcp` endpoint. To give an assistant the docs over MCP, use GitMCP or Context7 as the [Use with AI](https://laravel-rest-api.lomkit.com/digging-deeper/ai-skill) page explains. `context7.json` sets what Context7 indexes.
