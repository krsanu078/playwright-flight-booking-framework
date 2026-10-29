const { test, expect } = require('../fixtures/test-fixtures');

test.describe('Flight results (Step 2)', () => {
  test.beforeEach(async ({ atResultsStep }) => {
    // atResultsStep performs a valid one-way search and waits for flights.
  });

  test('TC-R01 results offer selectable flights', { tag: '@smoke' }, async ({ resultsPage }) => {
    await expect(resultsPage.flightRows.first()).toBeVisible();
    await expect(resultsPage.selectButtons.first()).toBeEnabled();
  });

  test('TC08 Continue is disabled until a flight is selected', { tag: '@regression' }, async ({ resultsPage }) => {
    await expect(resultsPage.continueButton).toBeDisabled();

    await resultsPage.selectFirstFlight();
    await expect(resultsPage.continueButton).toBeEnabled();
  });

  test('TC06 Price: Low to High orders fares ascending', { tag: '@regression' }, async ({ resultsPage }) => {
    await resultsPage.sortBy('price-asc');
    // Poll so we assert the re-ordered list, not the list before the sort re-rendered.
    await expect.poll(async () => {
      const prices = await resultsPage.getFarePrices();
      return prices.every((price, i) => i === 0 || prices[i - 1] <= price);
    }).toBe(true);
  });

  test('TC07 Non-stop filter keeps only non-stop flights', { tag: '@regression' }, async ({ resultsPage }) => {
    const before = await resultsPage.flightRows.count();
    await resultsPage.filterNonStopOnly();
    await expect(resultsPage.nonStopFilter).toBeChecked();

    await expect.poll(async () => {
      const rows = await resultsPage.getRowTexts();
      return rows.length > 0 && rows.length <= before && rows.every((t) => /\bnon-stop\b/i.test(t));
    }).toBe(true);
  });
});
