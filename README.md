# FitFlow Islamabad

**Student:** Muhammad Saim  
**Roll number:** 24i2064  
**Section:** CY-C  
**Course:** CS4032 Web Programming  
**Assignment:** 02 - Business Website Development Using React

FitFlow Islamabad is a responsive React application for discovering and booking small-group fitness classes. It is designed for university students and young professionals in Islamabad who need to compare class time, price, level, coach, and availability before making a selection.

All bookings and payments are simulated. The application uses only local data and browser storage.

## Links

- **GitHub repository:** https://github.com/cipherpunk112/Fitness-website
- **Deployed application:** https://fitflow-islamabad-booking-2026.flowingbeak1.chatgpt.site
- **Final commit:** To be entered after the final source is pushed to GitHub.

## Setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Commands

```bash
# Start the development server
npm run dev

# Create a production build
npm run build

# Preview the production build
npm run preview

# Run the required business-rule tests
npm test
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Business introduction, customer journey, and rules |
| `/classes` | Search, filter, sort, and select from 12 fitness classes |
| `/classes/:id` | Parameterized class details page |
| `/booking` | Change quantities, correct conflicts, complete the form, and review totals |
| `/confirmation` | Clear simulated booking result |
| `*` | Helpful invalid-route state |

## Main features

- Twelve local class records with stable IDs.
- A forthcoming Monday–Sunday demo schedule, with the full date shown on cards, details, the plan, and confirmation. The schedule rolls to the next complete week when loaded.
- Search across class name, coach, category, and description.
- Category and level filters, availability option, and sorting.
- Details pages with price, suitability, equipment, timing, coach, and places left.
- Shared weekly-plan state across listings, details, booking, and summary pages.
- Immutable add, update, and remove operations.
- Local-storage persistence and restored-selection checks.
- Controlled attendee form with specific validation while preserving valid entries.
- Calculated class count, place count, subtotal, and total.
- Asynchronous mock data loading with failure, retry, and loading states.
- Separate empty-dataset, no-match, empty-plan, and invalid-URL states.
- Responsive layouts for 390 px and 1280 px widths.
- Semantic controls, visible focus styles, form labels, status text, and keyboard access.

## Business rules

1. **Capacity:** One booking may contain 1-4 places per class and may not exceed the current places left.
2. **Eligibility:** Every attendee must be at least 16 years old. Age 16 is accepted; age 15 is rejected.
3. **Pricing:** The simulated online booking subtotal must be at least PKR 2,000. Exactly PKR 2,000 is accepted.

The capacity rule is exported from `src/rules/bookingRules.js`, used by the interface, and tested independently with Node's built-in test runner.

## Reproducing required edge cases

Open **Classes**, expand **Assignment demonstration controls**, and use:

- **Simulate loading failure:** replaces the schedule with a clear error state and working retry button.
- **Reduce availability:** makes Strength Foundations full and reduces Boxing Basics to one place. A previously saved selection is retained, explained, and must be corrected.
- **Restore normal schedule:** returns the original local data.

Other checks:

- Search for `swimming` to see the no-match state.
- Open `/classes/not-a-real-class` to see invalid-ID feedback.
- Open an unknown route to see the 404 recovery page.
- Submit an incomplete booking form to see field-specific errors without losing other valid entries.
- Refresh after adding a class to verify local-storage restoration.

## Simulated operations and limitations

- No real payment, email, account, database, or live capacity service is used.
- Availability changes only through the documented demonstration control.
- Local storage is device- and browser-specific.
- Dates and sessions are fictional. The next complete week's dates are generated locally; no real place is reserved.
- Missing optional descriptions, coach details, equipment, and icons show readable fallbacks.

## Concept map

| Concept | File | Component or function |
| --- | --- | --- |
| Routes and URL parameters | `src/App.jsx`, `src/pages/ClassDetailsPage.jsx` | `Routes`, `Route`, `useParams` |
| Shared state | `src/context/FitFlowContext.jsx` | `FitFlowProvider`, `useFitFlow` |
| Local data | `src/data/classes.js` | `fitnessClasses` |
| Async loading | `src/services/classService.js` | `loadFitnessClasses` |
| Schedule dates | `src/utils/schedule.js` | `nextWeekDate`, `classDate` |
| Search/filter/sort | `src/pages/ClassesPage.jsx` | `filteredClasses` |
| Props and callback props | `src/components/ClassCard.jsx` | `ClassCard`, `onAdd` |
| Controlled form | `src/pages/BookingPage.jsx` | `form`, `handleFieldChange` |
| Immutable array updates | `src/context/FitFlowContext.jsx` | `addToSelection`, `updateQuantity`, `removeFromSelection` |
| Derived values | `src/context/FitFlowContext.jsx` | `selectedRows`, `totalPlaces`, `subtotal` |
| Effects and storage | `src/context/FitFlowContext.jsx` | `useEffect` persistence and reconciliation |
| Business rules | `src/rules/bookingRules.js` | `validateTicketQuantity`, `validateAge`, `validateMinimumTotal` |
| Automated test | `tests/bookingRules.test.js` | Three capacity-boundary tests |
