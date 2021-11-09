const midtrans = require('midtrans-client');

const midtransSnap = new midtrans.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-iMbqKcL4u2-6jpP86RjUCMvG',
  clientKey: 'SB-Mid-client-6FfYm8PYwJ8sl8eu',
});

module.exports = { midtransSnap };
