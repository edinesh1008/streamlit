# Streamlit Enhancement Proposals (STEPs)

This directory contains Streamlit Enhancement Proposals (STEPs). STEPs are documents that describe a new feature or enhancement to Streamlit.

## When to write a STEP?

Not every change requires a STEP. However, having an approved STEP increases the likelihood that an enhancement PR gets merged. Changes that might not require a spec (case by case):

- Non‑user‑facing features
- Bug fixes
- DevOps‑related improvements
- Small, non‑controversial user‑facing enhancements (e.g., adding a single new parameter)

## How to propose a STEP?

1. Create a PR that copies [specs/0000-template.md](./0000-template.md) and fill it out.
   - PR title: `[STEP] <short, Title Case name>`, e.g., `[STEP] Datetime widget`
   - Filename: `0000-<kebab-case-slug>.md`, e.g., `0000-datetime-widget.md`. We will assign the correct number before merging.
   - Keep the PR in Draft until it’s ready for discussion.
2. When ready, mark the PR “Ready for review” on GitHub. The PR thread is the canonical place for discussion.
3. Approval requires at least two approvals from core maintainers. After approval:
   - If approved: Maintainers will assign the final number, rename the file, update the Status to Approved, and merge the STEP PR.
   - If rejected: The PR is closed with an explanation.

## STEP Lifecycle

- **Draft**: PR is in draft. Authoring and early feedback.
- **Review**: PR is marked ready for review. Open for broad feedback and discussion in the PR.
- **Approved**: Approved by core maintainers and merged. Ready for implementation.
- **Implemented**: The enhancement got implemented and merged.
- **Rejected:** PR was closed with rationale.
- **Deprecated:** Previously approved STEP got deprecated and is no longer relevant.
