# Kaduna HEFA Facility Integration Design

## Intent
Replace Lafimora's fictional facility directory with real government primary-care listings from Kaduna State's official Health Facility Analytics (HEFA) directory.

## Source decision
- Primary integration source: Kaduna State HEFA public facility endpoint, because it exposes Kaduna-specific PHC/clinic records without an API key and allows browser access.
- Future authoritative upgrade: Federal Ministry of Health HFR API, once Lafimora receives an API key.
- Rejected: copying facility names manually or exposing the complete HEFA raw response, because the latter contains survey respondent names and telephone fields that Lafimora does not need.

## Architecture
A repository sync script downloads government PHC/clinic pages from HEFA, normalizes the records, removes personal/survey fields, deduplicates by facility ID, and writes a compact `data/facilities.json` snapshot. The static frontend loads this local snapshot and falls back to a small bundled record set if loading fails.

## User-facing safety
- HEFA provenance and census vintage are visible in the directory.
- Service availability is described as recorded by HEFA, not guaranteed live.
- Users are told to confirm opening/service status before travelling.
- Directions use published facility coordinates; respondent phone numbers are never exposed.

