const { test, expect } = require('../fixtures/test-fixtures');
const { validPassenger, invalidEmails } = require('../utils/test-data');

test.describe('Passenger details (Step 3)', () => {
  test.beforeEach(async ({ atPassengerStep }) => {
    // atPassengerStep: valid search -> first flight selected -> continue.
  });

  test('TC-P01 valid passenger proceeds to payment', { tag: '@smoke' }, async ({ passengerPage, paymentPage }) => {
    await passengerPage.fillPassenger(validPassenger);
    await passengerPage.continueToPayment();
    await expect(paymentPage.cardNumber).toBeVisible();
    await expect(paymentPage.total).toBeVisible();
  });

  test('TC-P02 empty form does not advance to payment', { tag: '@regression' }, async ({ passengerPage, paymentPage }) => {
    await passengerPage.continueToPayment();
    await expect(passengerPage.nameValidation).toBeVisible();
    await expect(passengerPage.emailValidation).toBeVisible();
    await expect(passengerPage.phoneValidation).toBeVisible();
    await expect(paymentPage.cardNumber).toBeHidden();
  });

  for (const email of invalidEmails) {
    test(`TC09 invalid email "${email}" does not advance`, { tag: '@regression' }, async ({ passengerPage, paymentPage }) => {
      await passengerPage.fillPassenger({ ...validPassenger, email });
      await expect(passengerPage.emailInput).toHaveAttribute('type', 'email');
      await expect.poll(() => passengerPage.emailInput.evaluate((input) => input.validity.typeMismatch)).toBe(true);
      await passengerPage.continueToPayment();
      await expect(passengerPage.emailInput).toBeVisible();
      await expect(paymentPage.cardNumber).toBeHidden();
    });
  }
});
