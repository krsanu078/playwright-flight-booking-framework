# Flight Booking Playwright Test Framework

A JavaScript end-to-end automation framework for a multi-step flight-booking practice application. It demonstrates how to organize Playwright tests with the Page Object Model, reusable fixtures, data-driven scenarios, and a GitHub Actions CI pipeline.

> **Latest headless and headed full-suite runs:** 17/17 tests passed in Chromium. The headed script runs tests serially to avoid overloading the live third-party app; an earlier parallel headed run had four 30-second timeouts. Results can still be affected by site availability, response time, or UI changes. GitHub Actions is configured in this repository; check the Actions tab for the result of a particular push or pull request.

## What this project demonstrates

- Organizing browser automation around page objects and reusable Playwright fixtures.
- Covering a user journey across search, flight selection, passenger details, payment, and booking confirmation.
- Writing positive and negative UI checks with Playwright's web-first assertions.
- Separating reusable test data and environment configuration from test scenarios.
- Running tagged smoke and regression suites.
- Automating dependency installation, browser setup, test execution, and diagnostic artifact uploads with GitHub Actions.

This is a personal portfolio and learning project, not a production booking system or professional work-history claim.

## Application under test

The suite targets the [QA Practice flight-booking application](https://www.qapractice.com/flight-booking-scenarios), a third-party five-step demo:

**Search → Select flights → Passengers → Payment → Done**

The application documents `data-testid` attributes. Page objects use those test IDs for fixed controls and documented prefix patterns for flight rows and selection buttons.

## Technology

- JavaScript (CommonJS)
- Node.js 20 or newer
- [Playwright Test](https://playwright.dev/docs/intro)
- npm with a committed lockfile for reproducible CI dependency installation
- GitHub Actions on Ubuntu with Node.js 22 and Chromium

## Framework design

The test code is split into four layers:

| Layer | Location | Responsibility |
|---|---|---|
| Scenarios | `tests/*.spec.js` | Express user-visible behavior and hold the assertions. |
| Fixtures | `fixtures/test-fixtures.js` | Create page objects, open the application, and provide reusable setup at wizard steps. |
| Page objects | `pages/*.js` | Keep locators and user actions for each wizard step together. |
| Shared utilities | `utils/*.js` | Keep environment settings and reusable dummy data outside the scenarios. |

The `searchPage`, `resultsPage`, `passengerPage`, `paymentPage`, and `confirmationPage` fixtures expose page objects. The composable `atResultsStep`, `atPassengerStep`, and `atPaymentStep` fixtures advance through valid setup so tests can begin at the step they need. Each test receives an isolated Playwright context; tests do not depend on execution order or shared login state.

Assertions remain in the specs, rather than being hidden in page objects. Synchronization uses locator actions, web-first assertions, and `expect.poll` instead of fixed sleeps. The `searchCriteria` fixture option can be overridden with `test.use()` when a test needs different search data.

See [docs/framework-architecture.md](docs/framework-architecture.md) for the architecture diagram and further design notes.

## Test coverage

There are **17 automated cases** across four spec files:

| Spec | Coverage |
|---|---|
| `tests/flight-search.spec.js` | Search controls, valid one-way search, return-date visibility, empty search, and same-origin/destination validation. |
| `tests/flight-results.spec.js` | Flight availability and selection, selection-dependent navigation, ascending fare sort, and non-stop filtering. |
| `tests/passenger-details.spec.js` | Valid passenger details, empty-form validation, and three invalid-email inputs. |
| `tests/booking-flow.spec.js` | One-way booking and confirmation/PNR, empty-card non-confirmation, and passenger-count total comparison. |

The scenario-by-scenario list and the status of each case are in [docs/test-scenarios.md](docs/test-scenarios.md).

## Repository layout

```text
.github/workflows/playwright.yml   GitHub Actions workflow
docs/
  framework-architecture.md        Architecture diagram and design notes
  test-scenarios.md                Scenario inventory and coverage status
fixtures/
  test-fixtures.js                 Page-object and wizard-step fixtures
pages/
  BookingConfirmationPage.js       Confirmation and booking reference
  FlightResultsPage.js             Results, sorting, filtering, and selection
  FlightSearchPage.js              Search form and submission
  PassengerDetailsPage.js          Passenger form
  PaymentPage.js                   Payment form and displayed total
tests/
  booking-flow.spec.js             End-to-end booking scenarios
  flight-results.spec.js            Results-step scenarios
  flight-search.spec.js             Search-step scenarios
  passenger-details.spec.js         Passenger-step scenarios
utils/
  environment.js                   Base URL and environment flags
  test-data.js                     Shared search, passenger, and payment data
.env.example                       Documented environment-variable example
.gitignore
package.json
package-lock.json
playwright.config.js
README.md
```

## Prerequisites and setup

Install Node.js 20+ and npm, then from the repository root run:

```bash
npm ci
npx playwright install chromium
```

On Linux machines that need Playwright's browser system packages, use:

```bash
npx playwright install --with-deps chromium
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. The CI workflow uses the same clean-install command.

## Run the tests

| Goal | Command |
|---|---|
| Run all tests | `npm test` |
| Run smoke-tagged tests | `npm run test:smoke` |
| Run regression-tagged tests | `npm run test:regression` |
| Run with a visible browser (one worker) | `npm run test:headed` |
| Open Playwright Inspector | `npm run test:debug` |
| List discovered tests without running them | `npm run test:list` |
| Run one spec file | `npx playwright test tests/booking-flow.spec.js` |
| Repeat a spec to investigate intermittent failures | `npx playwright test --repeat-each=3 tests/booking-flow.spec.js` |
| Open the HTML report | `npm run report` |

Smoke and regression are test tags, not separate test configurations. Tests can carry more than one tag; the Playwright `--grep` commands select tests by tag.

### Browser projects

Chromium is the default project. To also run Firefox and WebKit locally, install their browsers and set `ALL_BROWSERS=true`:

```bash
npx playwright install firefox webkit
```

PowerShell:

```powershell
$env:ALL_BROWSERS = "true"
npx playwright test
```

macOS/Linux shell:

```bash
ALL_BROWSERS=true npx playwright test
```

The CI workflow currently installs and runs Chromium only.

### Configure the base URL

`BASE_URL` is the application origin; the booking path is appended by the search page object. The default origin is `https://www.qapractice.com`. For a compatible staging or local deployment:

PowerShell:

```powershell
$env:BASE_URL = "https://your-test-host.example"
npm test
```

macOS/Linux shell:

```bash
BASE_URL=https://your-test-host.example npm test
```

`.env.example` documents the variables, but Playwright does not automatically load `.env` files. Set the environment variable in the shell or your CI environment. Do not put credentials or real payment information in test data.

## Playwright configuration

`playwright.config.js` defines:

- The `tests/` test directory and Chromium project by default.
- Fully parallel test execution.
- A 30-second test timeout and 7-second expectation timeout.
- Two workers in CI; retries are disabled so transient live-site failures remain visible.
- `forbidOnly` in CI to prevent accidentally committed `test.only`.
- Headless browser execution.
- A list reporter and an HTML report.
- Screenshots, video, and traces retained on test failure.

When a live-site test fails, inspect the trace and page state to distinguish a test issue from a site/network issue.

## Continuous integration

The workflow in `.github/workflows/playwright.yml` runs for:

- Pushes to `main`.
- Pull requests targeting `main`.
- Manual runs through `workflow_dispatch`.

The job runs on `ubuntu-latest` and:

1. Checks out the repository.
2. Sets up Node.js 22 and enables npm dependency caching.
3. Runs `npm ci`.
4. Installs Chromium and its Linux dependencies.
5. Runs the Playwright suite headlessly.
6. Uploads the HTML report and test results, including failure diagnostics, as GitHub Actions artifacts with 14-day retention.

The workflow uses read-only `contents` permissions. The report and failure-artifact upload steps run unless the workflow is cancelled, so diagnostics remain available when tests fail. Review the run summary and artifacts in GitHub **Actions** to see the CI result for a commit.

## Reports and failure investigation

- `playwright-report/` contains the HTML report. Open it with `npm run report`.
- `test-results/` contains failed-test screenshots, videos, traces, and error context.
- To inspect a trace locally, run `npx playwright show-trace <path-to-trace.zip>`.
- In CI, download the `playwright-report` or `test-results` artifact from the workflow run.

These output folders are ignored by Git. Do not diagnose failures by merely increasing timeouts or retries; use the action log, screenshot, video, and trace to see what the browser was waiting for.

## Known limitations and scope

- The suite depends on a live third-party practice site. Site outages, slow responses, anti-automation changes, or UI changes can cause intermittent failures outside this repository's control.
- The latest headless and serial headed local full runs passed 17/17 tests, but a successful local run does not guarantee future local or CI runs will pass.
- Assertions reflect the application's currently verified display: fares and totals use USD, and non-stop rows are labeled “Non-stop.”
- Negative validation tests verify that the wizard does not advance; they do not assert exact validation-message text.
- Round-trip booking (the site's TC02) and passenger-count boundary tests are not automated.
- The happy path selects the first listed flight rather than asserting against a fixed flight number.
- The workflow is configured for CI, but do not infer a passing GitHub Actions result from a local run; check the repository's Actions tab for the current status.

## Possible next steps

- Verify and assert exact validation messages.
- Add round-trip booking and passenger-count boundary coverage.
- Strengthen fare and total parsing against verified application output.
- Consider running against a controlled test deployment to reduce dependence on a public third-party site.
- Add a scheduled CI run if regular monitoring is desired.

## Portfolio summary

This repository demonstrates a maintainable Playwright Test structure, page objects, composable fixtures, tagged test suites, reusable test data, environment-based configuration, browser automation across a multi-step UI flow, and GitHub Actions CI with failure diagnostics. The repository and this README document the work as a personal project; they do not claim professional production experience.

**Resume-ready highlights**

- Created a JavaScript Playwright framework with Page Object Model classes and composable fixtures for a five-step flight-booking journey.
- Implemented 17 positive and negative UI test cases across search, flight results, passenger validation, payment, and booking confirmation.
- Integrated GitHub Actions CI for pull requests, pushes to `main`, and manual runs, including clean dependency installation, Chromium setup, and retained failure artifacts.
