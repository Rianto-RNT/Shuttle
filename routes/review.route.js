const router = require('express').Router();
const {
  createReview,
  reviewAndRating,
} = require('../controller/reviewController');
const { isLogin, authorize } = require('../middleware/auth');
const {
  createReviewValidate,
} = require('../middleware/validation/reviewValidation');

router.post(
  '/',
  createReviewValidate,
  isLogin,
  authorize('user'),
  createReview
);
router.get('/', reviewAndRating);

module.exports = router;
