/** Step 2 - Select flights. Per-flight test IDs follow the documented patterns flight-result-<num> / flight-select-<num>. */
class FlightResultsPage {
  constructor(page) {
    this.page = page;
    this.sortSelect = page.getByTestId('flight-sort');
    this.airlineFilter = page.getByTestId('flight-filter-airline');
    this.nonStopFilter = page.getByTestId('flight-filter-nonstop');
    this.flightRows = page.locator('[data-testid^="flight-result-"]');
    this.selectButtons = page.locator('[data-testid^="flight-select-"]');
    this.continueButton = page.getByTestId('flight-continue-to-passengers');
  }

  async selectFirstFlight() {
    await this.selectButtons.first().click();
  }

  async selectFlight(flightNumber) {
    await this.page.getByTestId(`flight-select-${flightNumber}`).click();
  }

  async sortBy(optionValue) {
    await this.sortSelect.selectOption(optionValue);
  }

  async filterNonStopOnly() {
    await this.nonStopFilter.check();
  }

  async continueToPassengers() {
    await this.continueButton.click();
  }

  /**
   * Reads the first currency-prefixed amount from each visible flight row.
   * ASSUMPTION (unverified): fares are rendered with a $, EUR, GBP or INR symbol.
   * If that is wrong the error below says so instead of silently passing.
   */
  async getRowTexts() {
    return this.flightRows.allInnerTexts();
  }

  async getFarePrices() {
    const texts = await this.getRowTexts();
    return texts.map((text) => {
      const match = text.match(/[$€£₹]\s?([\d,]+(?:\.\d+)?)/);
      if (!match) throw new Error(`Could not find a fare in flight row text: ${JSON.stringify(text)}`);
      return Number(match[1].replace(/,/g, ''));
    });
  }
}

module.exports = { FlightResultsPage };
