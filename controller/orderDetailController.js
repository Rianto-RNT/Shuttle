const { OrderDetail, Order, UserReview } = require('../models');

async function createOrderDetail(detail) {
  const result = await OrderDetail.create({
    order_id: detail.order_id,
    bus_schedule_id: detail.bus_schedule_id,
    departure_date: detail.departure_date,
    return_date: detail.return_date,
  });
  return result;
}

async function updateCheckInStatus(req, res) {
  const { check_in_status, id } = req.body;
  try {
    const result = await OrderDetail.update(
      {
        check_in_status,
      },
      {
        where: {
          id,
        },
      }
    );
    if (!result)
      return res.status(400).json({
        status: 'failed',
        message: 'Order Detail is not found !',
      });
    return res.status(200).json({
      status: 'success',
      message: `Ticket has been updated into ${check_in_status}`,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured ', error: e });
  }
}

async function showAllOrderDetailWithReview(req, res) {
  try {
    const detail = await OrderDetail.findAll({
      where: {
        check_in_status: 'success',
      },
      include: [
        {
          model: Order,
          where: {
            user_id: req.user.id,
            order_status: 'success',
          },
        },
        {
          model: UserReview,
        },
      ],
    });

    return res.status(200).json({ status: 'success', data: detail });
  } catch (e) {
    return res
      .status(400)
      .json({
        status: 'failed',
        message: 'Error has been occured !',
        error: e,
      });
  }
}

module.exports = {
  createOrderDetail,
  showAllOrderDetailWithReview,
  updateCheckInStatus,
};
