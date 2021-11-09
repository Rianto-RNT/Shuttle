const { BusSchedule, Shuttle, Bus, BusProvider } = require('../models');
const Joi = require('joi').extend(require('@joi/date'));
const Op = require('sequelize').Op;
const { availableSeat } = require('../helper/seat');

async function searchSchedule(req, res) {
  try {
  const {
    departure_shuttle_id,
    arrival_shuttle_id,
    departure_date,
    return_date,
    passenger,
    order_type,
    time,
    r_time,
    sort_by,
    direction,
    bus_name,
  } = req.query;
  let return_r = [];
  let seats;
  let filtered_bus;
  let order;
  let bus;
  if (sort_by) {
    order = [[sort_by, direction]];
  } else {
    order = [];
  }
  if (bus_name) {
    bus = await BusSchedule.findAll({
      where: {
        departure_shuttle_id,
        arrival_shuttle_id,
      },
      order,
      include: [
        {
          model: BusProvider,
          where: {
            provider_name: bus_name,
          },
        },
        {
          model: Bus,
        },
      ],
    });
  } else {
    bus = await BusSchedule.findAll({
      where: {
        departure_shuttle_id,
        arrival_shuttle_id,
      },
      order,
      include: [BusProvider, Bus],
    });
  }
  if (bus.length == 0) {
    return res
      .status(400)
      .json({ status: 'failed', message: ' Bus is not found !' });
  }
  if (time) {
    const times = time.split('-');
    filtered_bus = bus.filter(
      (e) =>
        e.departure_time.includes(times[0]) && e.arrival_time.includes(times[1])
    );
  } else {
    filtered_bus = bus;
  }

  let departure_r = [];

  for (let i = 0; i < filtered_bus.length; i++) {
    const f = filtered_bus[i];
    const num1 = Number(f.departure_time.slice(0, 2));
    const num2 = Number(f.arrival_time.slice(0, 2));
    const selisih = num2 - num1;
    seats = (await availableSeat(departure_date, filtered_bus[i].id)).filter(
      (e) => e == 0
    ).length;
    departure_r.push({
      busId: f.id,
      departureTime: f.departure_time,
      arrivalTime: f.arrival_time,
      departureShuttleId: f.departure_shuttle_id,
      arrivalShuttleId: f.arrival_shuttle_id,
      destinationCity: f.destination_city,
      arrivalCity: f.departure_city,
      arrivalShuttle: f.arrival_shuttle,
      departure_shuttle: f.departure_shuttle,
      price: f.price,
      BusProvider: f.BusProvider.provider_name,
      roadtime: selisih,
      date: departure_date,
      seats: seats,
    });
  }

  let fil_bus;
  if (order_type == 'RoundTrip') {
    const return_bus = await BusSchedule.findAll({
      where: {
        departure_shuttle_id: arrival_shuttle_id,
        arrival_shuttle_id: departure_shuttle_id,
      },
      include: [BusProvider, Bus],
    });

    if (r_time) {
      const r_times = r_time.split('-');
      fil_bus = return_bus.filter(
        (e) =>
          e.departure_time.includes(r_times[0]) &&
          e.arrival_time.includes(r_times[1])
      );
    } else {
      fil_bus = return_bus;
    }
    for (let i = 0; i < fil_bus.length; i++) {
      const f = fil_bus[i];
      const num1 = Number(f.departure_time.slice(0, 2));
      const num2 = Number(f.arrival_time.slice(0, 2));
      const selisih = num2 - num1;
      seats = (await availableSeat(return_date, fil_bus[i].id)).filter(
        (e) => e == 0
      ).length;
      return_r.push({
        busId: f.id,
        departureTime: f.departure_time,
        arrivalTime: f.arrival_time,
        departureShuttleId: f.departure_shuttle_id,
        arrivalShuttleId: f.arrival_shuttle_id,
        destinationCity: f.destination_city,
        arrivalCity: f.departure_city,
        arrivalShuttle: f.arrival_shuttle,
        departure_shuttle: f.departure_shuttle,
        price: f.price,
        BusProvider: f.BusProvider.provider_name,
        roadtime: selisih,
        date: departure_date,
        seats: seats,
      });
    }
  }
  return res
    .status(200)
    .json({ status: 'success', departure: departure_r, return: return_r });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'error has occured !', error: e });
  }
}

async function searchShuttle(req, res) {
  try {
    const shuttle = await Shuttle.findAll();
    return res.status(200).json({ status: 'success', data: shuttle });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'error has occured', error: e });
  }
}

// Export
module.exports = { searchSchedule, searchShuttle };
