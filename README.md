# Flight Booking End-to-End Automation Framework

A **personal learning project**: a Playwright (JavaScript, CommonJS) test framework for a multi-step flight-booking demo. It is a portfolio piece, not professional production experience.

> **Latest local verification:** all 17 tests passed in a full run against the live site. The suite depends on a third-party site, so network or site instability can still cause intermittent failures; see [Known limitations](#known-limitations).

## Application under test

<https://www.qapractice.com/flight-booking-scenarios> - a free practice site with a 5-step wizard: Search -> Select flights -> Passengers -> Payment -> Done. It documents stable `data-testid` values, which this project uses.

## Architecture and design choices

- **Page Object Model** - one class per wizard step in `pages/`; locators and actions only, assertions live in specs.
- **Fixtures** (`fixtures/test-fixtures.js`) - page objects plus `atResultsStep` / `atPassengerStep` / `atPaymentStep` fixtures that move the wizard forward, so each test starts at the step it cares about without copy-pasted set-up.
- **Test data** (`utils/test-data.js`) - dummy values; dates are computed relative to today (the site's example date is already in the past).
- **Config** (`utils/environment.js`, `playwright.config.js`) - `BASE_URL` via environment variable, CI-aware retries/workers.
- **No sleeps** - only web-first assertions and `expect.poll`.

Diagram: [docs/framework-architecture.md](docs/framework-architecture.md). Scenario table: [docs/test-scenarios.md](docs/test-scenarios.md).

## Technology stack

Playwright Test, JavaScript (CommonJS), Node.js 20+ (CI uses 22), npm, GitHub Actions.

## Folder structure

```
.github/workflows/playwright.yml   CI workflow
pages/                             Page objects (5 wizard steps)
tests/                             Specs by feature (search, results, passenger, booking flow)
fixtures/test-fixtures.js          Custom fixtures
utils/                             test-data.js, environment.js
docs/                              Architecture diagram, scenario table
playwright.config.js
```

## Prerequisites

Node.js 20 or newer and npm.

## Installation

```bash
npm install                      # also creates package-lock.json - commit it (CI uses npm ci)
npx playwright install chromium  # add --with-deps on Linux
```

## Running tests

| Goal | Command |
|------|---------|
| All tests | `npm test` |
| Smoke (`@smoke`) | `npm run test:smoke` |
| Regression (`@regression`) | `npm run test:regression` |
| Visible browser | `npm run test:headed` |
| Playwright Inspector (debug) | `npm run test:debug` |
| List tests without running | `npm run test:list` |
| Open HTML report | `npm run report` |
| Single file | `npx playwright test tests/booking-flow.spec.js` |
| Other browser | `ALL_BROWSERS=true npx playwright test` (adds Firefox + WebKit; install them first) |
| Other base URL | `BASE_URL=https://example.test npm test` |

## Reporting and debugging

- **HTML report:** `npm run report` (generated into `playwright-report/`, git-ignored).
- **Screenshots / videos / traces:** kept only for failed tests, in `test-results/<test-name>/`.
- **Trace viewer:** `npx playwright show-trace test-results/<test-name>/trace.zip` (or drop the zip on <https://trace.playwright.dev>).
- **CI artifacts:** GitHub -> Actions -> the run -> *Artifacts* -> download `playwright-report` and `test-results`.
- **Flaky tests:** reproduce with `npx playwright test --repeat-each=10 <file>`, read the trace to find the missing wait or shared state, and fix the locator/assertion. Don't just raise timeouts or retries.

## GitHub Actions

`.github/workflows/playwright.yml` runs on push/PR to `main` and manually (`workflow_dispatch`). It checks out, sets up Node 22 with npm cache, runs `npm ci`, installs Chromium with OS dependencies, runs `npm test`, then uploads the report and `test-results` (14-day retention) even when tests fail. Tests run headless by default; use `npm run test:headed` for a visible local browser. Permissions are `contents: read`. **Requires `package-lock.json` to be committed.** Check the GitHub Actions tab for the latest workflow result.

## Supported test scenarios

17 test cases covering search, results (sort, filter, selection rule), passenger validation and the booking flow (one-way). Full list and status: [docs/test-scenarios.md](docs/test-scenarios.md).

## Known limitations

- The live practice site is outside this project's control. Slow responses, outages, or UI changes can cause intermittent failures; inspect the saved trace and report before treating a failure as a test bug.
- Some assertions still rest on assumptions flagged in code comments: fare text contains a currency symbol (TC06), non-stop rows contain "non-stop" (TC07), and total text is a single number (TC10).
- Validation **message text and selectors were not verified**, so negative tests assert that the wizard does *not advance* rather than checking the message. Tighten them after inspecting the DOM (`npx playwright codegen https://www.qapractice.com/flight-booking-scenarios`).
- Round-trip booking (site TC02) and passenger-count boundaries are not automated.
- The first listed flight is selected rather than a fixed flight number, because only `GW100` is documented and its route is unknown.
- Depends on a third-party site being up.

## Future improvements

Assert real validation messages, add round-trip booking, passenger-count boundary tests, an accessibility check, and a scheduled CI run.

## What a reviewer can learn here

How POM, fixtures and data separation keep specs short; tag-based suites; relative test data; honest handling of unverified assumptions; and a CI pipeline that always publishes diagnostics.
