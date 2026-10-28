const base = require('@playwright/test');
const { FlightSearchPage } = require('../pages/FlightSearchPage');
const { FlightResultsPage } = require('../pages/FlightResultsPage');
const { PassengerDetailsPage } = require('../pages/PassengerDetailsPage');
const { PaymentPage } = require('../pages/PaymentPage');
const { BookingConfirmationPage } = require('../pages/BookingConfirmationPage');
const { validSearch, validPassenger } = require('../utils/test-data');

const { expect } = base;

/**
 * Two kinds of fixtures:
 *  1. Page objects (searchPage, resultsPage, ...) - plain constructors. searchPage also opens the app.
 *  2. Wizard-step fixtures (atResultsStep, atPassengerStep, atPaymentStep) - move the wizard forward
 *     using valid data so a test can start at the step it actually cares about. Each one
 *     waits for an element of the next step, so no sleeps are needed.
 * The wizard has no login and no server-side state we rely on, so every test starts from a fresh page.
 */
const test = base.test.extend({
  // Overridable per file/describe with test.use({ searchCriteria: {...} })
  searchCriteria: [validSearch, { option: true }],

  searchPage: async ({ page }, use) => {
    const searchPage = new FlightSearchPage(page);
    await searchPage.goto();
    await use(searchPage);
  },
  resultsPage: async ({ page }, use) => use(new FlightResultsPage(page)),
  passengerPage: async ({ page }, use) => use(new PassengerDetailsPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  confirmationPage: async ({ page }, use) => use(new BookingConfirmationPage(page)),

  atResultsStep: async ({ searchPage, resultsPage, searchCriteria }, use) => {
    await searchPage.search(searchCriteria);
    await expect(resultsPage.flightRows.first()).toBeVisible();
    await use();
  },

  atPassengerStep: async ({ atResultsStep, resultsPage, passengerPage }, use) => {
    await resultsPage.selectFirstFlight();
    await resultsPage.continueToPassengers();
    await expect(passengerPage.nameInput).toBeVisible();
    await use();
  },

  atPaymentStep: async ({ atPassengerStep, passengerPage, paymentPage }, use) => {
    await passengerPage.fillPassenger(validPassenger);
    await passengerPage.continueToPayment();
    await expect(paymentPage.cardNumber).toBeVisible();
    await use();
  },
});

module.exports = { test, expect };
