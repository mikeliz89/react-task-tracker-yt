# Shared Profile Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load the signed-in user's profile once into shared application context and use it for both the profile page and BMI calculator, while keeping height editable.

**Architecture:** `ProfileSettingsContext` remains the single Firebase profile subscription. It exposes profile values and a method to persist profile edits and update shared state. `ManageMyProfile` uses that context for its initial values and submits edits through the shared method.

**Tech Stack:** React 17, React Context, Firebase Realtime Database, Jest and React Testing Library.

**Spec:** Approved design in the conversation: share the signed-in user's profile through the existing context, remove the duplicate profile-page subscription, and keep height editable and saved.

## Global Constraints

- Preserve the current Firebase profile location and profile fields.
- Scope shared profile values to the currently signed-in user.
- Keep the existing maximum height validation of 220 cm.

## Review Focus

- When the signed-in user changes or logs out, stale profile values must not remain visible. Pin this behavior in Task 1's context tests.
- When the profile height changes and is saved, the shared value must update for consumers. Pin this behavior in Task 1's context tests.
- A Firebase profile with no height must remain editable without rendering an uncontrolled field. Keep height input value normalized in Task 2.

---

### Task 1: Shared profile context

**Files:**
- Modify: `src/contexts/ProfileSettingsContext.js`
- Test: `src/tests/ProfileSettingsContext.test.js`

**Interfaces:**
- Produces: `useProfileSettings()` returns `name`, `height`, `disableScrollToTopAnimation`, and `saveProfile(profile)`; `saveProfile` persists to `DB.PROFILES/<uid>` and updates shared state after success.

- [x] **Step 1: Write failing context tests**

Test that the provider subscribes for the current user's profile, exposes its name and height, calls the prior user's unsubscribe when the user changes, clears profile fields on logout, and updates exposed height after `saveProfile` resolves.

- [x] **Step 2: Run tests to verify they fail**

Run: `npm test -- --watchAll=false --runTestsByPath src/tests/ProfileSettingsContext.test.js`
Expected: FAIL because the provider does not yet expose `name` or `saveProfile`.

- [x] **Step 3: Implement shared profile loading and saving**

Keep one Firebase subscription in the provider, expose the profile name and existing settings, and implement `saveProfile(profile)` using `updateToFirebaseById`. Update context state after the write succeeds.

- [x] **Step 4: Run context tests**

Run: `npm test -- --watchAll=false --runTestsByPath src/tests/ProfileSettingsContext.test.js`
Expected: PASS.

### Task 2: Use shared profile on profile page

**Files:**
- Modify: `src/components/MyProfile/ManageMyProfile.js`

**Interfaces:**
- Consumes: `useProfileSettings()` from Task 1, including `name`, `height`, `disableScrollToTopAnimation`, and `saveProfile(profile)`.

- [x] **Step 1: Remove duplicate subscription and connect profile form**

Initialize and synchronize the editable profile fields from context, normalize an absent height to an empty input value, and submit profile changes via `saveProfile` while preserving the existing 220 cm validation and modified timestamp.

- [x] **Step 2: Verify the production build**

Run: `npm run build`
Expected: Build completes successfully.
