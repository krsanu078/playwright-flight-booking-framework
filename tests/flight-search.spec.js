const { test, expect } = require('../fixtures/test-fixtures');
const { validSearch } = require('../utils/test-data');

test.describe('Flight search (Step 1)', () => {
  test('TC-S01 search form shows all documented controls', { tag: '@smoke' }, async ({ searchPage }) => {
    await expect(searchPage.fromSelect).toBeVisible();
    await expect(searchPage.toSelect).toBeVisible();
    await expect(searchPage.departureDate).toBeVisible();
    await expect(searchPage.passengers).toBeVisible();
    await expect(searchPage.travelClass).toBeVisible();
    await expect(searchPage.oneWayCheckbox).toBeVisible();
    await expect(searchPage.searchButton).toBeEnabled();
  });

  test('TC-S02 valid one-way search lists flights', { tag: '@smoke' }, async ({ searchPage, resultsPage }) => {
    await searchPage.search(validSearch);
    await expect(resultsPage.flightRows.first()).toBeVisible();
    await expect(resultsPage.sortSelect).toBeVisible();
  });

  test('TC03 return date shows only for round trips', { tag: '@regression' }, async ({ searchPage }) => {
    await searchPage.setOneWay(false);
    await expect(searchPage.returnDate).toBeVisible();

    await searchPage.setOneWay(true);
    await expect(searchPage.returnDate).toBeHidden();
  });

  test('TC04 empty From/To does not advance to results', { tag: '@regression' }, async ({ searchPage, resultsPage }) => {
    await searchPage.submit();
    // Negative checks pass instantly, so first re-assert we are still on step 1.
    await expect(searchPage.searchButton).toBeVisible();
    await expect(resultsPage.flightRows).toHaveCount(0);
    await expect(resultsPage.sortSelect).toBeHidden();
  });

  test('TC05 same origin and destination does not advance', { tag: '@regression' }, async ({ searchPage, resultsPage }) => {
    await searchPage.search({ ...validSearch, from: 'Paris', to: 'Paris' });
    await expect(searchPage.searchButton).toBeVisible();
    await expect(resultsPage.flightRows).toHaveCount(0);
    await expect(resultsPage.sortSelect).toBeHidden();
  });
});
