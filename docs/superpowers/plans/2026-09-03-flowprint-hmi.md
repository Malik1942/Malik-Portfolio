# FlowPrint HMI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A live 16:9 printer HMI on `/project/flowprint` Final Design that a recruiter can operate, matching the Interfaces Lab 1600×900 cluster.

**Architecture:** One React module `FlowPrintHmi` with local screen/lane state. Figma photos are scenery; chrome is DOM. Registered as `flowprint-hmi` on the existing case-study template.

**Tech Stack:** React 18, Vite, Tailwind, Vitest, Testing Library, framer-motion `useReducedMotion`.

## Global Constraints

- 16:9 panel, case-study content width, no phone bezel, no product URL.
- No case-study First-time/Pro/Next chrome around the screen.
- Bambu Lab X1-Carbon stays on the machine photo.
- Simulated only: reload resets; print ~5s; empty password does not continue.
- Tests lock the journey, not glass pixels.

## File structure

- Create: `src/components/project-detail/FlowPrintHmi.tsx`
- Create: `src/components/project-detail/FlowPrintHmi.test.tsx`
- Create: `src/assets/flowprint-*.webp` (printer, AMS, print part, models, filament samples)
- Modify: `src/components/project-detail/ProjectDetailTemplate.tsx` — register `flowprint-hmi`
- Modify: `src/data/projectDetails.ts` — `[[module:flowprint-hmi]]` after Final Design opening paragraph

### Task 1: Journey tests + HMI + wire-up

TDD: write `FlowPrintHmi.test.tsx` (spec lock list), watch fail, implement `FlowPrintHmi`, register module, export Figma scenery, verify in browser on `/project/flowprint`.
