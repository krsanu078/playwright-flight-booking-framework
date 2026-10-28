/** Step 5 - Confirmation. */
class BookingConfirmationPage {
  constructor(page) {
    this.page = page;
    this.successHeading = page.getByTestId('flight-booking-success');
    this.bookingReference = page.getByTestId('flight-pnr');
  }
}

module.exports = { BookingConfirmationPage };
