# Test Scenarios

**Status legend:** The automated scenarios passed in the latest recorded local full-suite run (17/17). Because the suite uses a live third-party site, this records an observed run, not a guarantee of future local or CI results.

IDs `TC01`-`TC10` are the site's own scenario IDs from its "Test Cases & Expected Behaviors" section. `TC-xNN` IDs are additional scenarios of this project.

| Test ID | Scenario | Type | Expected result | Automation status |
|---------|----------|------|-----------------|-------------------|
| TC-S01 | Search form shows all documented controls | Positive | From, To, departure, passengers, class, One Way and Search are visible; Search enabled | Automated; passed in latest local run |
| TC-S02 | Valid one-way search lists flights | Positive | Flight rows and sort control appear | Automated; passed in latest local run |
| TC03 | Return date only for round trips | Positive | Return date visible when One Way unticked, hidden when ticked | Automated; passed in latest local run |
| TC04 | Search with empty From/To | Negative | Does not advance to results | Automated; passed in latest local run; exact message not asserted |
| TC05 | Same origin and destination | Negative | Does not advance to results | Automated; passed in latest local run; exact message not asserted |
| TC-R01 | Results offer selectable flights | Positive | A flight row and enabled Select button are shown | Automated; passed in latest local run |
| TC08 | Continue disabled until a flight is selected | Negative | Disabled before selection, enabled after | Automated; passed in latest local run |
| TC06 | Sort "Price: Low to High" | Positive | Fares non-decreasing | Automated; passed in latest local run; assumes currency symbol in row text |
| TC07 | Non-stop filter | Positive | Remaining rows are all non-stop | Automated; passed in latest local run; assumes "non-stop" text in row |
| TC-P01 | Valid passenger details | Positive | Payment step is shown with a total | Automated; passed in latest local run |
| TC-P02 | Empty passenger form | Negative | Does not advance to payment | Automated; passed in latest local run |
| TC09 | Invalid email (3 inputs) | Negative | Does not advance to payment | Automated as 3 data-driven tests; passed in latest local run |
| TC01 | One-way booking happy path | Positive | "Booking Confirmed" and a booking reference (PNR) | Automated; passed in latest local run |
| TC-B02 | Pay with empty card details | Negative | Booking is not confirmed | Automated; passed in latest local run |
| TC10 | Total reflects passenger count | Positive | Total for 2 passengers = 2 x total for 1 | Automated; passed in latest local run; assumes numeric total text |
| TC02 | Round-trip booking | Positive | Both flights in confirmation; total covers both fares | **Not automated** - how the return flight list is rendered is not documented |
