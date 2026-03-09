# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and survey platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and Supabase. Content is in Spanish.

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint (uses next/core-web-vitals and next/typescript configs)

No test framework is configured.

## Architecture

**Routing:** Next.js App Router with file-based routing under `app/`. Each route is a directory with a `page.tsx`.

**Current routes:**
- `/` — Home/landing page (server component)
- `/encuesta` — AI class interest survey (client component)
- `/encuesta-tenis` — Tennis/padel analytics survey (client component)

**Data layer:** Supabase client initialized in `lib/supabase.ts`. Survey forms insert directly into Supabase tables (`encuesta_ia`, `encuesta_tenis`). Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

**Styling:** Tailwind CSS 4 via PostCSS plugin (`@tailwindcss/postcss`). All styling is inline utility classes — no CSS modules or component libraries. Dark mode supported via `dark:` variants. Global CSS variables and Geist fonts defined in `app/globals.css`.

**Path alias:** `@/*` maps to the project root (configured in tsconfig.json).

## Conventions

- Survey pages use `"use client"` and define helper sub-components (`RadioGroup`, `CheckboxGroup`) inline within the same file
- Form state managed with `useState`; client-side validation with red border visual feedback on required fields
- Supabase errors are checked after insert and displayed to the user
- Semantic HTML for forms (`fieldset`, `legend`, `label`)
- TypeScript strict mode is enabled
