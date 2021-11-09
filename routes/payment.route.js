const router = require('express').Router();
const {
  createPayment,
  paymentHandling,
  showPaymentDetail,
  showPaymentByStatus,
} = require('../controller/paymentController');
const { isLogin, authorize } = require('../middleware/auth');
const {
  createPaymentValidate,
} = require('../middleware/validation/paymentValidation');

router.get('/', createPaymentValidate, createPayment);
router.post('/handling', paymentHandling);
router.get('/detail', isLogin, showPaymentDetail);
router.get('/show/status', isLogin, authorize('user'), showPaymentByStatus);

module.exports = router;
