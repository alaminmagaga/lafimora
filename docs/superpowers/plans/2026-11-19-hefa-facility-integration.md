# Kaduna HEFA Facility Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fictional facilities with a privacy-safe snapshot of official Kaduna HEFA government PHC and clinic listings.

**Architecture:** A Node sync script fetches and normalizes HEFA data into compact JSON. Existing vanilla-JS screens load that JSON asynchronously and preserve offline fallback behaviour.

**Tech Stack:** Vanilla JavaScript, Node.js fetch, JSON, HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-11-19-hefa-facility-integration-design.md`

## Global Constraints
- Do not expose respondent names or phone numbers from raw survey records.
- Clearly state the HEFA source and 2018 census vintage.
- Never claim opening or service status is live-confirmed.

## Review Focus
- HEFA pagination and duplicate facility rows.
- Missing coordinates, names, or service fields.
- Offline data-load failure.
- Facility detail links and IDs.
- Location sorting with records that lack coordinates.

---

### Task 1: Build privacy-safe facility snapshot
- [ ] Add a failing snapshot validation test.
- [ ] Add the HEFA sync/normalization script.
- [ ] Generate and validate `data/facilities.json`.

### Task 2: Integrate facility screens
- [ ] Load the snapshot before facility-dependent rendering.
- [ ] Replace demo labels, warnings, details, directions, and counts with HEFA-backed equivalents.
- [ ] Preserve a labelled offline fallback.

### Task 3: Verify
- [ ] Run unit/static tests and JavaScript syntax checks.
- [ ] Browser-test search, filtering, details, and mobile layout.

