const router = require('express').Router();
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const reviewRoute = require('./review.route');
const passportRoute = require('./passport.route');
const busRoute = require('./bus.route');
const paymentRoute = require('./payment.route');
const searchBus = require('./searchBus.route');
const notificationRoute = require('./notification.route');
const { isLogin, authorize } = require('../middleware/auth');

router.use('/user', userRoute);
router.use('/auth', passportRoute);
router.use('/review', reviewRoute);
router.use('/order', isLogin, authorize('user'), orderRoute);
router.use('/bus', isLogin, authorize('bus_provider'), busRoute);
router.use('/payment', paymentRoute);
router.use('/search', searchBus);
router.use('/notification', isLogin, notificationRoute);
router.get('/', (req, res) => {
  res.status(200).json({ message: 'HELLO WORLD' });
});

module.exports = router;
