# Dashboard Quick Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a signed-in user enter their current weight directly from the dashboard and save weight plus calculated BMI without navigating to the BMI calculator.

**Architecture:** Add an accessible circular plus control beside the notifications button in the app header on every signed-in page. It reveals an overlay quick-action list below it. Selecting the weight action opens a modal. The modal uses profile-context height, existing BMI translations, and the existing Firebase weight-history path and record shape.

**Tech Stack:** React 17, React Bootstrap, React Context, Firebase Realtime Database, i18next, SCSS.

**Spec:** `docs/superpowers/specs/2026-11-09-dashboard-quick-actions-design.md`

## Global Constraints

- Keep the weight entry flow on the dashboard; do not navigate to the BMI calculator.
- Prefill height from the signed-in user's profile when available, and keep it editable.
- Save records using the existing BMI calculator's weight-history path and fields.
- Keep current app translations and visual conventions.

## Review Focus

- A missing profile height leaves the height field blank and still editable.
- Invalid or missing height/weight does not write a record.
- The plus control and quick action work by keyboard and announce expanded/collapsed state.
- A failed Firebase write keeps the modal open and reports failure.

---

### Task 1: Dashboard weight entry modal

**Files:**
- Create: `src/components/Dashboard/QuickWeightEntryModal.js`
- Modify: `src/components/Dashboard/Dashboard.js`
- Modify: `src/components/Site/Header.js`
- Modify: `public/assets/locales/fi/translation.json`
- Modify: `public/assets/locales/en/translation.json`

**Interfaces:**
- Consumes: `useProfileSettings().height`, `pushToFirebase`, `DB.WEIGHT_HISTORY`, and existing BMI calculator translations.
- Produces: a dashboard modal that accepts editable height and weight, computes BMI, persists `{ weight, currentDateTime, bmi }`, and reports success or failure to its caller. Use a write-awaiting data-tier helper so the modal only reports success after Firebase confirms the write.

- [x] **Step 1: Add the modal and localized quick action**

Create the form modal and add translated text for the quick action and round plus control. Use existing BMI validation, formula, and data shape. Keep it open on validation or save failure; after a successful save, close it and display the BMI confirmation on the dashboard.

- [x] **Step 2: Integrate the menu into the dashboard**

Place the circular plus button next to notifications in the header on every signed-in route. Make it toggle an overlay list directly below; the list currently contains **Syötä tämänhetkinen paino**. Selecting that action opens the modal without changing routes.

- [x] **Step 3: Verify the change**

Run the focused test/build checks available in the project and inspect the final diff for exact translations, keyboard access, and the Firebase payload.
