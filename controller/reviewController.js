const {
  UserReview,
  Order,
  BusSchedule,
  Bus,
  Shuttle,
  BusProvider,
  User,
  OrderDetail,
} = require('../models');

async function createReview(req, res) {
  try {
    const { order_detail_id, review, rating } = req.body;
    const [result, created] = await UserReview.findOrCreate({
      where: {
        user_id: req.user.id,
        order_detail_id: order_detail_id,
      },
      defaults: {
        ...req.body,
        user_id: req.user.id,
      },
    });
    if (!created)
      return res
        .status(400)
        .json({
          status: 'failed',
          message: 'review has been created for this order !',
        });

    return res
      .status(200)
      .json({ status: 'success', message: 'review created !' });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', error: e, message: 'error has occured !' });
  }
}

async function reviewAndRating(req, res) {
  try {
    const { bus_schedule_id } = req.query;
    const findBusRating = await UserReview.findAll({
      include: [
        {
          model: OrderDetail,
          where: {
            bus_schedule_id: bus_schedule_id,
          },
        },
        {
          model: User,
        },
      ],
    });
    if (findBusRating.length == 0)
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'No review yet for this bus !',
          rating: 0,
        });
    let rating = 0;
    const reviewSummary = [];

    findBusRating.forEach((e) => {
      rating += e.rating;
      reviewSummary.push({
        rating: e.rating,
        review: e.review,
        fullname: e.User.fullname,
      });
    });

    const totalRating = Math.floor(rating / findBusRating.length)
      ? Math.floor(rating / findBusRating.length)
      : 0;
    return res
      .status(200)
      .json({
        status: 'success',
        rating: totalRating,
        allReview: reviewSummary,
      });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured ! ', error: e });
  }
}

module.exports = { createReview, reviewAndRating };
