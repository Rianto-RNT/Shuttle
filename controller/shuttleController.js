const { Shuttle, BusProvider, BusSchedule } = require('../models');

async function createShuttle(req, res) {
  try {
    const body = req.body;
    const [result, created] = await Shuttle.findOrCreate({
      where: {
        shuttle_name: body.shuttle_name,
        city: body.city,
        user_id: req.user.id,
      },
      defaults: {
        city: body.city,
        shuttle_name: body.shuttle_name,
        address: body.address,
        user_id: req.user.id,
        total_bus: 0,
        published: body.published,
      },
    });
    if (!created)
      return res
        .status(400)
        .json({
          status: 'failed',
          message: 'this shuttle has been created',
          pastCreatedData: result,
        });
    return res.status(200).json({ status: 'success', message: result });
  } catch (e) {
    return res
      .status(400)
      .json({
        status: 'failed',
        error: e,
        message: 'Error has been occured !',
      });
  }
}

async function findShuttleByUserId(city, name, userId) {
  const shuttleId = await Shuttle.findOne({
    where: {
      shuttle_name: name,
      city: city,
      user_id: userId,
    },
  });
  return shuttleId;
}

async function addBusInShuttle(num, shuttleId) {
  const shuttle = await Shuttle.update(
    { total_bus: num },
    {
      where: {
        id: shuttleId,
      },
    }
  );
  return shuttle;
}

async function deleteBusInShuttle(shuttleId) {
  const shuttle = await Shuttle.findOne({
    where: {
      id: shuttleId,
    },
  });

  const update = await Shuttle.update(
    { total_bus: shuttle.total_bus - 1 },
    {
      where: {
        id: shuttleId,
      },
    }
  );
  return update;
}

async function findShuttleById(req, res) {
  const shuttle = await Shuttle.findAll({
    where: {
      user_id: req.user.id,
      id: req.params.id,
    },
  });
  return res.send(shuttle);
}

async function showAllShuttle(req, res) {
  try {
    const showAllShuttle = await Shuttle.findAll({
      where: { user_id: req.user.id },
    });
    res.status(200).json({
      status: 'success',
      message: 'success retrived data',
      data: showAllShuttle,
    });
    if (showAllShuttle.length == 0) throw new Error();
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'internal server error',
    });
  }
}

async function updateShuttle(req, res) {
  const body = req.body;
  const shuttleId = req.params.id;
  try {
    const updateShuttle = await Shuttle.update(
      { ...body },
      {
        where: {
          id: shuttleId,
        },
      }
    );
    if (!updateShuttle[0]) {
      res.status(400).json({
        status: 'failed',
        message: 'unable to update',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'bus has been update successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'internal server error',
    });
  }
}

async function deleteShuttle(req, res) {
  try {
    const deleteShuttle = await Shuttle.destroy({
      where: { id: req.body.id },
    });
    return res.status(200).json({
      status: 'success',
      message: 'deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'internal server error',
    });
  }
}

module.exports = {
  createShuttle,
  findShuttleByUserId,
  deleteShuttle,
  updateShuttle,
  showAllShuttle,
  addBusInShuttle,
  findShuttleById,
  deleteBusInShuttle,
};
