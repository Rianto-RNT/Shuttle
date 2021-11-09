const {
  Order,
  BusSchedule,
  Passenger,
  Bus,
  OrderDetail,
} = require('../models');
const { Op } = require('sequelize');

async function availableSeat(date, bus_schedule) {
  const passengerOne = await Passenger.findAll({
    include: [
      {
        model: Order,
        where: {
          [Op.or]: [{ order_status: 'pending' }, { order_status: 'success' }],
        },
        include: [
          {
            model: OrderDetail,
            where: {
              bus_schedule_id: bus_schedule,
              departure_date: date,
            },
          },
        ],
      },
    ],
  });
  const passengerTwo = await Passenger.findAll({
    include: [
      {
        model: Order,
        where: {
          [Op.or]: [{ order_status: 'pending' }, { order_status: 'success' }],
        },
        include: [
          {
            model: OrderDetail,
            where: {
              bus_schedule_id: bus_schedule,
              return_date: date,
            },
          },
        ],
      },
    ],
  });

  let totalSeat = 40;
  const seatArrangement = [];
  for (let i = 0; i < totalSeat; i++) {
    seatArrangement.push(0);
  }

  if (passengerOne.length != 0) {
    passengerOne.forEach((e) => {
      seatArrangement[e.departure_seat - 1] = 'BOOKED';
    });
  } else if (passengerTwo.length != 0) {
    passengerTwo.forEach((e) => {
      seatArrangement[e.return_seat - 1] = 'BOOKED';
    });
  }

  return seatArrangement;
}

module.exports = { availableSeat };
