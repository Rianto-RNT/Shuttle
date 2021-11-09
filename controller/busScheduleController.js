const {
  BusSchedule,
  sequelize,
  BusProvider,
  Bus,
  Shuttle,
} = require('../models');
const { createBus } = require('../controller/busController');
const {
  findShuttleByUserId,
  addBusInShuttle,
  deleteBusInShuttle,
} = require('../controller/shuttleController');

const { Sequelize, Transaction, DATEONLY, DATE } = require('sequelize');

async function createBusSchedule(req, res) {
  try {
    const {
      departure_city,
      departure_shuttle,
      destination_city,
      arrival_shuttle,
    } = req.body;
    const { id } = req.user;
    const departureShuttle = await findShuttleByUserId(
      departure_city,
      departure_shuttle,
      id
    );
    const arrivalShuttle = await findShuttleByUserId(
      destination_city,
      arrival_shuttle,
      id
    );
    if (departureShuttle.id == arrivalShuttle.id)
      return res.status(400).json({
        status: 'failed',
        message: 'each shuttle cannot be the same !',
      });

    const busVendor = await BusProvider.findOne({
      where: {
        user_id: id,
      },
    });

    const result = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        const body = req.body;
        const bus = await createBus(
          {
            ...body,
          },
          { transaction: t }
        );
        if (!bus) {
          return res.status(400).json({
            status: 'failed',
            message: 'Bus failed created !',
          });
        }
        const busSchedule = await BusSchedule.create(
          {
            departure_shuttle_id: departureShuttle.id,
            arrival_shuttle_id: arrivalShuttle.id,
            bus_id: bus.id,
            bus_provider_id: busVendor.id,
            ...body,
          },
          { transaction: t }
        );
        if (!busSchedule) {
          return res.status(400).json({
            status: 'failed',
            message: 'Bus failed created !',
          });
        }
        await addBusInShuttle(
          departureShuttle.total_bus + 1,
          departureShuttle.id
        );
        return res.status(200).json({ status: 'success', data: busSchedule });
      }
    );
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has been occcured !' });
  }
}
async function findBusSchedule(req, res) {
  try {
    const result = await BusSchedule.findOne({
      where: {
        id: req.query.id,
      },
      include: [Bus],
    });
    if (!result) {
      return res.status(400).json({
        status: 'failed',
        message: 'No bus Schedule is found !',
      });
    }
    return res.status(200).json({ status: 'message', data: result });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured !', error: e });
  }
}
async function updateBusSchedule(req, res) {
  const result = await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
    async (t) => {
      try {
        const findBus = await BusSchedule.findOne({
          where: { id: req.params.id },
        });
        const schedule = await BusSchedule.update(
          {
            departure_time: req.body.departure_time,
            arrival_time: req.body.arrival_time,
            price: req.body.price,
          },
          {
            where: {
              id: req.params.id,
            },
          },
          { transaction: t }
        );

        const bus = await Bus.update(
          { ...req.body },
          {
            where: {
              id: findBus.bus_id,
            },
          },
          { transaction: t }
        );
        return res.status(200).json({
          status: 'success',
          message: 'updated success, you can only update time & price ! ',
        });
      } catch (e) {
        return res
          .status(400)
          .json({ status: 'failed', message: 'Error has occured ', error: e });
      }
    }
  );
}

async function deleteBusSchedule(req, res) {
  const result = await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
    async (t) => {
      try {
        const findBus = await BusSchedule.findOne({
          where: { id: req.params.id },
        });
        const schedule = await BusSchedule.destroy(
          {
            where: {
              id: req.params.id,
            },
          },
          { transaction: t }
        );

        const bus = await Bus.destroy(
          {
            where: {
              id: findBus.bus_id,
            },
          },
          { transaction: t }
        );

        deleteBusInShuttle(findBus.departure_shuttle_id);

        return res
          .status(200)
          .json({ status: 'success', message: 'Bus deleted !' });
      } catch (e) {
        return res
          .status(400)
          .json({ status: 'failed', message: 'Error has occured ', error: e });
      }
    }
  );
}

async function showAllBus(req, res) {
  try {
    const busVendor = await BusProvider.findOne({
      where: {
        user_id: req.user.id,
      },
    });
    if (!busVendor)
      return res
        .status(400)
        .json({ status: 'failed', message: 'Bus vendor is not found !' });
    const bus = await BusSchedule.findAll({
      where: {
        bus_provider_id: busVendor.id,
      },
      include: [
        {
          model: Bus,
        },
      ],
    });
    if (!bus)
    return res
      .status(400)
      .json({ status: 'failed', message: 'Bus is not found !' });
    return res.status(200).json({ status: 'success', data: bus });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured !' });
  }
}

module.exports = {
  createBusSchedule,
  showAllBus,
  updateBusSchedule,
  deleteBusSchedule,
  findBusSchedule,
};
