// All values are dummy data. Card/passenger values are the ones the practice
// site itself documents; origin/destination cities come from its dropdowns.

// The site documents 2026-08-01 in its example, which is already in the past
// relative to many runs, so dates are computed relative to "today".
function isoDateFromToday(daysAhead) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysAhead);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD, the format <input type="date"> accepts
}

const CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Mumbai', 'Delhi', 'Dubai', 'Singapore'];

const validSearch = {
  from: 'New York',
  to: 'London',
  departureDate: isoDateFromToday(30),
  returnDate: isoDateFromToday(37),
  passengers: 1,
  travelClass: 'Economy',
  oneWay: true,
};

const validPassenger = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+15550100',
};

const invalidEmails = ['not-an-email', 'ada@', 'ada example.com'];

// Test card number commonly used by payment sandboxes; documented by the site.
const validPayment = {
  cardNumber: '4111111111111111',
  expiry: '12/30',
  cvv: '123',
};

module.exports = { CITIES, validSearch, validPassenger, invalidEmails, validPayment, isoDateFromToday };
