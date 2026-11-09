# Dashboard Quick Actions — Design

## Intent

Add a round plus button beside the notifications button in the app header on every page for signed-in users. Clicking it reveals an overlay list below it. The first action, **Syötä tämänhetkinen paino**, lets a signed-in user record weight without navigating to the wellbeing tab or BMI calculator page.

## Approaches

- **Inline form:** selecting the weight action expands its form inside the quick-actions list. This keeps the flow in the page, but makes the list area grow.
- **Modal form (selected):** selecting the weight action opens a dialog over the dashboard. This keeps the dashboard compact and gives the height/weight form clear focus.

## Behavior

- The plus button appears beside notifications on every signed-in page and toggles an overlay quick-actions list below itself, like the notifications panel.
- The list currently contains **Syötä tämänhetkinen paino** and is structured so more quick actions can be added later.
- Selecting **Syötä tämänhetkinen paino** opens a modal with height prefilled from the signed-in user's profile, editable, and weight blank.
- Submitting validates height and weight, calculates BMI, saves weight and BMI to the same history path as `BmiCalculator`, and shows the result.
- The quick action completes its save on the dashboard; it never redirects to the BMI calculator.
- Keep the modal open if validation or saving fails. On successful save, show confirmation and close the modal.
- Reuse the app's translation, button, alert, profile context, and Firebase data-layer patterns.

## Scope

- Modify the dashboard, app header, and focused quick-action/modal UI as needed.
- Do not change the existing BMI calculator behavior or add other shortcuts in this change.
- Use existing dependencies and styles; keep the control accessible by keyboard and give the plus button an expanded state.

## Builder decisions

- Use the current profile context for height; if no profile height exists, leave it blank.
- Use the current BMI formula and weight-history data shape.
- Render the circular plus control beside notifications in the app header on every signed-in page; the overlay list must not move page content.
