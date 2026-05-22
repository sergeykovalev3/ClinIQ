<p align="center">
  <img src="https://img.shields.io/badge/ClinIQ-Health%20clarity-1D9E8C?style=for-the-badge&labelColor=080B0F" alt="ClinIQ" />
</p>

<h1 align="center">ClinIQ</h1>

<p align="center">
  <strong>We break down your labs and records so you know what to do next.</strong>
</p>

<p align="center">
  A polished marketing site for a B2C health product — plain-language explanations,<br />
  visit prep, and a clear path to upload labs and records.
</p>

<p align="center">
  <a href="#getting-started"><strong>Getting started</strong></a>
  &nbsp;·&nbsp;
  <a href="#tech-stack"><strong>Stack</strong></a>
  &nbsp;·&nbsp;
  <a href="#project-structure"><strong>Structure</strong></a>
</p>

<br />

## Overview

**ClinIQ** helps people upload lab results and medical documents, understand them in everyday language, and walk into appointments with focused questions.

This repo is the public landing experience: motion-led storytelling, scroll-driven sections, and conversion-focused CTAs. It is **decision support only** — not diagnosis, treatment, or a substitute for a licensed physician.

<br />

## Highlights

| | |
|---|---|
| **Motion-first UX** | Intro preloader, smooth scroll, scroll-linked reveals, magnetic CTAs, hash navigation with a curtain transition |
| **Scroll that stays honest** | Lenis runs on GSAP’s ticker; ScrollTrigger tracks real scroll position without drift |
| **Reduced-motion aware** | Animations respect system preferences; content stays readable when motion is off |
| **Clean architecture** | App Router, thin routes, sections for page blocks, shared UI in `components/` |

<br />

## Tech stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=000000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Lenis-1.3-1D9E8C?style=for-the-badge&logoColor=white" alt="Lenis" />
  <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</p>

<br />

## Getting started

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/sergeykovalev3/ClinIQ.git
cd cliniiq
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint across the project |

<br />

## Project structure

```
src/
  app/           Routes, metadata, global styles
  views/         Page compositions
  sections/      Full-width blocks (Hero, How it works, Stories, …)
  components/    Reusable UI and layout providers
  hooks/         Shared React hooks
  lib/           Site copy, motion config, utilities
public/
  images/        Marketing imagery
  favicon/       Icons and web manifest
```

<br />

## On the page

| Section | What it does |
|---------|----------------|
| **Hero** | Positioning, marquee, intro reveal |
| **How it works** | Pinned scroll on desktop; stacked steps on mobile |
| **Stories** | Real-world scenarios with magnetic card visuals |
| **Pricing** | Plans with scroll-driven reveal |
| **Contact** | Say hello + curved handoff into upload |
| **Upload** | Lead form, stacked file UI, footer |

<br />

## Disclaimer

ClinIQ supports understanding and visit preparation. It does **not** provide medical advice, diagnosis, or treatment. Always follow the guidance of a qualified clinician for health decisions.

<br />

<p align="center">
  <sub>Built for clarity — calm, direct, and human.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-1D9E8C?style=flat-square" alt="Active" />
  <img src="https://img.shields.io/badge/license-private-080B0F?style=flat-square" alt="Private" />
</p>
