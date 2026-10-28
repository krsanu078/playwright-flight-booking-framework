// Central place for environment-driven configuration. No secrets live here.
module.exports = {
  baseURL: process.env.BASE_URL || 'https://www.qapractice.com',
  bookingPath: '/flight-booking-scenarios',
  isCI: !!process.env.CI,
  allBrowsers: process.env.ALL_BROWSERS === 'true',
};
