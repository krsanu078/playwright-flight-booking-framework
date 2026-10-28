const { bookingPath } = require('../utils/environment');

/** Step 1 - Search Flights. Locators use the site's documented data-testid values. */
class FlightSearchPage {
  constructor(page) {
    this.page = page;
    this.fromSelect = page.getByTestId('flight-from');
    this.toSelect = page.getByTestId('flight-to');
    this.departureDate = page.getByTestId('flight-departure-date');
    this.returnDate = page.getByTestId('flight-return-date');
    this.passengers = page.getByTestId('flight-passengers');
    this.travelClass = page.getByTestId('flight-class');
    this.oneWayCheckbox = page.getByTestId('flight-one-way');
    this.searchButton = page.getByTestId('flight-search');
  }

  async goto() {
    await this.page.goto(bookingPath);
  }

  async setOneWay(isOneWay) {
    await this.oneWayCheckbox.setChecked(isOneWay);
  }

  /** Fills the form without submitting. Return date is only touched for round trips. */
  async fillSearch({ from, to, departureDate, returnDate, passengers, travelClass, oneWay }) {
    if (from) await this.fromSelect.selectOption(from);
    if (to) await this.toSelect.selectOption(to);
    if (departureDate) await this.departureDate.fill(departureDate);
    if (passengers) await this.passengers.fill(String(passengers));
    if (travelClass) await this.travelClass.selectOption(travelClass);
    if (oneWay !== undefined) await this.setOneWay(oneWay);
    if (oneWay === false && returnDate) await this.returnDate.fill(returnDate);
  }

  async submit() {
    await this.searchButton.click();
  }

  async search(criteria) {
    await this.fillSearch(criteria);
    await this.submit();
  }
}

module.exports = { FlightSearchPage };
