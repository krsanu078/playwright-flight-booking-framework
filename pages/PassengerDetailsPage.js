/** Step 3 - Passenger details. */
class PassengerDetailsPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByTestId('flight-passenger-name');
    this.emailInput = page.getByTestId('flight-passenger-email');
    this.phoneInput = page.getByTestId('flight-passenger-phone');
    this.nameValidation = page.getByText('Please enter the traveller name.', { exact: true });
    this.emailValidation = page.getByText('Please enter an email.', { exact: true });
    this.phoneValidation = page.getByText('Please enter a phone number.', { exact: true });
    this.continueButton = page.getByTestId('flight-continue-to-payment');
  }

  async fillPassenger({ name, email, phone }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async continueToPayment() {
    await this.continueButton.click();
  }
}

module.exports = { PassengerDetailsPage };
