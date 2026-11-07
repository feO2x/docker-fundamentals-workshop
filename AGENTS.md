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

## Good to know

- The slides (`slides.html`, `src/slides/`) use the reveal.js setup of the Linux Fundamentals workshop: one vertical `BlockStack` per agenda block with its `SectionSlide` on top, `navigationMode: 'linear'`, and a separate Vite entry so Reveal and highlight.js stay out of the agenda bundle. Its pitfalls apply here as well. Fragments that follow a multi-step `StepCode` belong inside `WhenDeckReady`, otherwise they appear before the code steps. `BlockStack` sets `data-start-indexv="0"` so → always enters a block at its section slide. `slides.html?transition=none` is handy for screenshots. Fragments inside `WhenDeckReady` stay hidden with `fragments=false`.
- `StepCode` highlights one line per step by default. `steps={false}` shows all lines at once, e.g. for commands on an exercise slide.
- The "Warum Docker?" slides use floating tags of official images (`src/slides/images.ts`). The versions and `/etc/os-release` values on the slides were read from the registries on 2026-11-07: `python:3.12` is 3.12.16 and `python:3.13` is 3.13.18, both on Debian 13 (trixie). `mcr.microsoft.com/dotnet/sdk:10.0` is Ubuntu 24.04.5 LTS (since .NET 10, Microsoft's default images are Ubuntu-based), starts `/bin/bash`, sets `DOTNET_NOLOGO=true` and is about 350 MB compressed. Re-check them before each workshop.
- The push exercises use a local `registry:2` container instead of the internal Harbor registry, because not every attendee can reach Harbor. It listens on host port 5050 (`REGISTRY_RUN` in `src/slides/images.ts`), because the AirPlay receiver occupies port 5000 on macOS.
- Docker isn't installed on the machine the slides were written on. `.github/workflows/exercises.yml` therefore plays every exercise through on a GitHub runner, and the sample outputs on the slides (`docker ps`, `docker logs`, `docker history`, cache hits, build times, image sizes from Docker 29's `docker image ls` with `DISK USAGE`/`CONTENT SIZE`) come from its logs. When an exercise changes, update the workflow and take the outputs from its next run. The slides import the Dockerfiles from `exercises/` with `?raw` (`src/slides/dockerfile.ts` strips comment lines), so they always show the tested files.
- .NET 10 has no Debian images (only previews had `trixie-slim`). The runtime variants on the base image slide are Ubuntu (default), Alpine and `noble-chiseled`.
- The final exercise is the repair variant: `exercises/zaehler/Dockerfile` is broken on purpose (single stage on the SDK, `COPY . .` before restore, `ASPNETCORE_URLS=http://localhost:5000`), and the colleague's run command lacks the volume. `exercises/loesungen/zaehler.Dockerfile` is the fix. The app runs as root, because a non-root user would need the volume directory prepared in the image, which is beyond this workshop.
- Bind mounts on the slides use `"${PWD}/…"`, which works in both Bash and PowerShell. `.gitattributes` keeps scripts and Dockerfiles at LF, because CRLF from a Windows checkout breaks them in the container.
