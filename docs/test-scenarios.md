# Test Scenarios

**Status legend:** *Implemented - not yet run* means the code exists and was collected by `playwright test --list`, but it has **not** been executed against the live site (the authoring environment had no network access). No test is claimed to pass.

IDs `TC01`-`TC10` are the site's own scenario IDs from its "Test Cases & Expected Behaviors" section. `TC-xNN` IDs are additional scenarios of this project.

| Test ID | Scenario | Type | Expected result | Automation status |
|---------|----------|------|-----------------|-------------------|
| TC-S01 | Search form shows all documented controls | Positive | From, To, departure, passengers, class, One Way and Search are visible; Search enabled | Implemented - not yet run |
| TC-S02 | Valid one-way search lists flights | Positive | Flight rows and sort control appear | Implemented - not yet run |
| TC03 | Return date only for round trips | Positive | Return date visible when One Way unticked, hidden when ticked | Implemented - not yet run |
| TC04 | Search with empty From/To | Negative | Does not advance to results | Implemented - not yet run (message text not asserted, see limitations) |
| TC05 | Same origin and destination | Negative | Does not advance to results | Implemented - not yet run (message text not asserted) |
| TC-R01 | Results offer selectable flights | Positive | A flight row and enabled Select button are shown | Implemented - not yet run |
| TC08 | Continue disabled until a flight is selected | Negative | Disabled before selection, enabled after | Implemented - not yet run |
| TC06 | Sort "Price: Low to High" | Positive | Fares non-decreasing | Implemented - not yet run (assumes currency symbol in row text) |
| TC07 | Non-stop filter | Positive | Remaining rows are all non-stop | Implemented - not yet run (assumes "non-stop" text in row) |
| TC-P01 | Valid passenger details | Positive | Payment step is shown with a total | Implemented - not yet run |
| TC-P02 | Empty passenger form | Negative | Does not advance to payment | Implemented - not yet run |
| TC09 | Invalid email (3 inputs) | Negative | Does not advance to payment | Implemented - not yet run (3 data-driven tests) |
| TC01 | One-way booking happy path | Positive | "Booking Confirmed" and a booking reference (PNR) | Implemented - not yet run |
| TC-B02 | Pay with empty card details | Negative | Booking is not confirmed | Implemented - not yet run |
| TC10 | Total reflects passenger count | Positive | Total for 2 passengers = 2 x total for 1 | Implemented - not yet run (assumes numeric total text) |
| TC02 | Round-trip booking | Positive | Both flights in confirmation; total covers both fares | **Not automated** - how the return flight list is rendered is not documented |
