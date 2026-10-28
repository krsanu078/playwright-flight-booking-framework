const { test, expect } = require('../fixtures/test-fixtures');
const { validSearch, validPassenger, validPayment } = require('../utils/test-data');

test.describe('Booking flow (Steps 1-5)', () => {
  test('TC01 one-way booking shows confirmation and PNR', { tag: ['@smoke', '@regression'] }, async ({
    searchPage, resultsPage, passengerPage, paymentPage, confirmationPage,
  }) => {
    await searchPage.search(validSearch);
    await resultsPage.selectFirstFlight();
    await resultsPage.continueToPassengers();
    await passengerPage.fillPassenger(validPassenger);
    await passengerPage.continueToPayment();
    await expect(paymentPage.total).toBeVisible();
    await paymentPage.fillPayment(validPayment);
    await paymentPage.payAndConfirm();

    await expect(confirmationPage.successHeading).toContainText('Booking Confirmed');
    await expect(confirmationPage.bookingReference).toHaveText(/\S+/);
  });

  test('TC-B02 payment step without card details does not confirm', { tag: '@regression' }, async ({
    atPaymentStep, paymentPage, confirmationPage,
  }) => {
    await paymentPage.payAndConfirm();
    await expect(paymentPage.bookButton).toBeVisible();
    await expect(confirmationPage.successHeading).toBeHidden();
  });

  test('TC10 total for 2 passengers is twice the 1-passenger total', { tag: '@regression' }, async ({
    searchPage, resultsPage, passengerPage, paymentPage,
  }) => {
    // Runs the wizard to the payment step and returns the displayed total.
    // The first listed flight is selected each time, so the fare is the same in both runs.
    async function totalFor(passengers) {
      await searchPage.goto(); // reloads the wizard at step 1
      await searchPage.search({ ...validSearch, passengers });
      await resultsPage.selectFirstFlight();
      await resultsPage.continueToPassengers();
      await passengerPage.fillPassenger(validPassenger);
      await passengerPage.continueToPayment();
      await expect(paymentPage.total).toBeVisible();
      return paymentPage.getTotalAmount();
    }

    const single = await totalFor(1);
    const double = await totalFor(2);
    expect(double).toBe(single * 2);
  });
});
