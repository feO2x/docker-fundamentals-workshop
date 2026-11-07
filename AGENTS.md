# Root AGENTS.md

This repo contains all assets for my Docker Fundamentals workshop that I give at TELIS/GWVS. This workshop is aimed at beginners and builds on my Linux Fundamentals workshop (`~/Code/linux-fundamentals-workshop`), which serves as the blueprint for this repo.

## General

- When committing, sign off and use a Conventional Commits message. Decide whether a message body should be included depending on the changes.

## Feedback Loops

Install dependencies with `npm ci` before running these commands.

- `npm run lint`: lints `src/` with oxlint (React, TypeScript, and oxc rules from `.oxlintrc.json`).
- `npm run build`: type-checks the project with `tsc -b` and builds the production bundle into `dist/` with Vite.
- `npm run format:check`: checks formatting with Prettier. Use `npm run format` to fix formatting issues.

CI (`.github/workflows/ci.yml`) runs these commands on pull requests, `.github/workflows/deploy.yml` runs them before deploying to GitHub Pages.

`.github/workflows/deploy.yml` deploys `main` to the root of GitHub Pages and every open pull request from this repo as a preview under `pr/<number>/`, and links the preview in a comment on the PR. GitHub Pages keeps a single site per repo, so every run rebuilds all of them, and closing a PR removes its preview with the next run. PR events arrive via `pull_request_target`, because the `github-pages` environment only lets `main` deploy. For the same reason, changes to `deploy.yml` take effect only after they are merged into `main`. A PR that changes the workflow gets a `pull_request` dry run that builds the site but doesn't deploy. Pull requests from forks never get a preview, because their code would run with access to the Pages deployment.

## Good to know

- The agenda page has no link to slides yet. `.cta` in `src/App.css` is kept for the "Zu den Folien" button once the slides exist.
- The push exercises use a local `registry:2` container instead of the internal Harbor registry, because not every attendee can reach Harbor.
