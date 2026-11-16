# Verification Checklist

| Area | User action | Expected behaviour | Observed result |
| --- | --- | --- | --- |
| Missing class ID | Open `/classes/not-a-real-class` | Explain the invalid class and link to available classes | Pass |
| Unknown page | Open `/unknown-route` | Show 404 feedback and recovery actions | Pass |
| No matches | Search `swimming` | Distinguish no matches from an empty dataset and offer filter reset | Pass |
| Form validation | Submit blank or invalid attendee data | Show specific messages while preserving valid fields | Pass |
| Restored plan | Add a class, refresh, and return to My plan | Restore the selected class and quantity | Pass |
| Changed availability | Select two Boxing Basics places, then reduce availability | Keep the choice, explain the conflict, and block completion | Pass |
| Loading failure | Use the failure control | Show a clear error and a working retry button | Pass |
| Quantity boundary | Select exactly four places where seats permit | Accept four places | Pass |
| Quantity above boundary | Attempt five places | Reject and explain the four-place maximum | Pass |
| Age boundary | Enter age 16 | Accept the eligibility boundary | Pass |
| Under age | Enter age 15 | Reject with a specific age message | Pass |
| Minimum total | Use a subtotal below PKR 2,000 | Show the exact amount still required and block confirmation | Pass |
| Keyboard | Tab through navigation, filters, cards, quantities, and form | Logical order and visible focus indicators | Pass |
| Responsive desktop | Use 1280 px width | Three-column catalogue and readable booking layout | Pass |
| Responsive mobile | Use 390 px width | Single-column layout without page-wide horizontal overflow | Pass |
| Console | Complete the main journey with DevTools open | No application errors or React warnings | Pass |

Automated command: `npm test`

Result: 3 tests passed, 0 failed. The tested rule is the same `validateTicketQuantity` function used by the React application.
