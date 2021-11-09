const { Notification } = require('../models');

async function createNotification(data) {
  const { title, status, description, user_id } = data;
  try {
    const result = await Notification.create({
      user_id,
      title,
      status,
      description,
    });
    return result;
  } catch (e) {
    throw new Error();
  }
}

async function showAllNotification(req, res) {
  const { id } = req.user;
  try {
    const result = await Notification.findAll({
      where: {
        user_id: id,
      },
    });
    if (result.length == 0) {
      return res
        .status(400)
        .json({ status: 'failed', message: 'No notification yet ', data: [] });
    }
    return res.status(200).json({ status: 'success', data: result });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured ', error: e });
  }
}
module.exports = { createNotification, showAllNotification };
