# Frontend Decisions

## Decision 1 - Make schedule information dependable and recoverable

| Field | Entry |
| --- | --- |
| Problem | Aura Studio warns that displayed class times may be one hour later than the actual start time and asks visitors to verify the daily lineup elsewhere. This weakens confidence in the schedule used for booking. |
| Decision | Load one local schedule source asynchronously, calculate the dates for the next complete week, and show the full date and time across cards, details, plan, and confirmation. Show explicit loading, failure, retry, and changed-availability states. |
| Alternative | Show a static timetable and a general warning that users should contact the studio before attending. |
| Reason | Students planning around lectures need one dependable task flow and a clear recovery path when data cannot be loaded. |
| Tradeoff | A recurring fictional schedule is suitable for demonstration but is not a live timetable. The mock loader and controls add recovery code. |
| Code location | `src/utils/schedule.js`; `src/services/classService.js`; `src/context/FitFlowContext.jsx`; `src/pages/ClassesPage.jsx`; date display in cards, booking, and confirmation. |
| Evidence | Compare a class date on its card, details, plan, and confirmation. On Classes, choose **Simulate loading failure**, verify the error explanation, and use **Retry loading**. |

## Decision 2 - Put comparison information on every class card

| Field | Entry |
| --- | --- |
| Problem | The Hard Knocks standing timetable shows class name, days, time, and coach, while pricing is a separate link and live remaining capacity is not shown in the timetable. Users must move between places to compare suitability and cost. |
| Decision | Each FitFlow card shows level, places left, day/time, coach, and price before the user opens the details page or adds a class. Search, filters, and sort work together. |
| Alternative | Keep cards minimal and show price, capacity, and suitability only on the details page. |
| Reason | The main customer task is comparing classes around schedule, budget, and experience. Showing decision information early reduces unnecessary navigation. |
| Tradeoff | Cards contain more information and require a responsive stacked layout on small screens. |
| Code location | `src/components/ClassCard.jsx`; filtering logic in `src/pages/ClassesPage.jsx`; responsive card rules in `src/styles/global.css`. |
| Evidence | At 1280 px, compare multiple cards in one row. At 390 px, verify every card stacks without horizontal overflow and keeps the primary actions accessible. |

## Decision 3 - Preserve the plan and explain invalid restored selections

| Field | Entry |
| --- | --- |
| Problem | The Kind Fitness booking page uses a calendar plus a long class list without a unified search/filter comparison area. Repeated exploration can make it difficult to keep track of choices while narrowing options. |
| Decision | Keep selected classes in shared context and local storage even when search or filters hide them. If availability later conflicts with a saved quantity, retain the selection, explain the exact conflict, and block completion until corrected. |
| Alternative | Clear hidden, unavailable, or conflicting selections automatically. |
| Reason | Preserving user work supports comparison across categories and gives the user control over correction. This decision concerns interaction and state behaviour. |
| Tradeoff | The booking page needs conflict messaging and reconciliation logic instead of silently resetting state. |
| Code location | `src/context/FitFlowContext.jsx`; conflict UI in `src/pages/BookingPage.jsx`; demonstration controls in `src/components/DemoControls.jsx`. |
| Evidence | Add two Boxing Basics places, refresh, choose **Reduce availability**, and verify that the plan is preserved with a one-place availability message and blocked confirmation. |
