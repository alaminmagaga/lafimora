# Lafimora Template Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all Lafimora pages to match the supplied template and replace generic remote photography with Northern Nigerian imagery.

**Architecture:** Preserve the existing static page shell and rendering functions. Introduce local image assets through the existing `photo()` abstraction and update global CSS tokens/components so the redesign reaches every route without duplicating markup.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js static verification.

**Spec:** `docs/superpowers/specs/2026-11-17-lafimora-template-restyle-design.md`

## Global Constraints
- Preserve existing behaviour and bilingual content.
- Use local project-bound imagery for all photo slots.
- Maintain responsive layouts and visible keyboard focus.

## Review Focus
- No remote Unsplash dependencies remain.
- Every image key resolves locally.
- Cream/green/peach tokens are present and readable.
- Mobile layout retains usable controls and image crops.
- Existing routes and JavaScript syntax remain valid.

---

### Task 1: Local image library

**Files:** Create `assets/images/*.png`; modify `app.js`; test `tests/design.test.js`.

- [ ] Write and run failing assertions for local image mappings.
- [ ] Copy approved generated imagery into the project.
- [ ] Update `photo()` and image keys, then rerun tests.

### Task 2: Template design system

**Files:** Modify `styles.css`; test `tests/design.test.js`.

- [ ] Write and run failing assertions for palette and typography.
- [ ] Apply the token-led editorial restyle across shared components.
- [ ] Rerun tests and inspect desktop/mobile renders.

### Task 3: Verification

**Files:** Verify all HTML routes, `app.js`, `styles.css`, and assets.

- [ ] Run syntax and static design tests.
- [ ] Serve locally and capture responsive browser screenshots.
- [ ] Fix visual regressions and rerun verification.

