/** Step 4 - Payment (demo form; dummy card data only). */
class PaymentPage {
  constructor(page) {
    this.page = page;
    this.total = page.getByTestId('flight-total');
    this.cardNumber = page.getByTestId('flight-card-number');
    this.expiry = page.getByTestId('flight-expiry');
    this.cvv = page.getByTestId('flight-cvv');
    this.bookButton = page.getByTestId('flight-book');
  }

  async fillPayment({ cardNumber, expiry, cvv }) {
    await this.cardNumber.fill(cardNumber);
    await this.expiry.fill(expiry);
    await this.cvv.fill(cvv);
  }

  async payAndConfirm() {
    await this.bookButton.click();
  }

  /**
   * Numeric value of the displayed total.
   * ASSUMPTION (unverified): the total text contains one amount, e.g. "$498.00".
   */
  async getTotalAmount() {
    const text = await this.total.innerText();
    const amount = Number(text.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(amount) || amount === 0) throw new Error(`Could not parse a total from: ${JSON.stringify(text)}`);
    return amount;
  }
}

module.exports = { PaymentPage };
