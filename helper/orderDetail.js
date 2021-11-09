const {
  Order,
  OrderDetail,
  BusProvider,
  BusSchedule,
  Bus,
  Passenger,
} = require('../models');
const moment = require('moment');

async function orderDetail(order_id) {
  let result;
  const order = await Order.findOne({
    where: {
      id: order_id,
    },
    include: [
      {
        model: OrderDetail,
        include: [
          {
            model: BusSchedule,
            include: [Bus, BusProvider],
          },
        ],
      },
    ],
  });
  
  if (order.order_type == 'RoundTrip') {
    const priceOne = order.OrderDetails[0].BusSchedule.price;
    const priceTwo = order.OrderDetails[1].BusSchedule.price;
    const passenger = order.total_passenger;
    result = {
      orderId: order.id,
      orderDate: moment(order.date).format('YYYY-MM-DD'),
      total_passenger: passenger,
      order_status: order.order_type,
      destination:
        '' +
        order.OrderDetails[0].BusSchedule.departure_city +
        '-' +
        order.OrderDetails[0].BusSchedule.destination_city,
      price_detail: {
        bus_name_one: order.OrderDetails[0].BusSchedule.Bus.bus_name,
        bus_provider_one:
          order.OrderDetails[0].BusSchedule.BusProvider.provider_name,
        price_one: priceOne,
        bus_name_two: order.OrderDetails[1].BusSchedule.Bus.bus_name,
        bus_provider_two:
          order.OrderDetails[1].BusSchedule.BusProvider.provider_name,
        price_two: priceTwo,
        total: (priceTwo + priceOne) * passenger,
      },
    };
  } else {
    const priceOne = order.OrderDetails[0].BusSchedule.price;
    const passenger = order.total_passenger;
    result = {
      orderId: order.id,
      orderDate: moment(order.date).format('YYYY-MM-DD'),
      total_passenger: order.total_passenger,
      order_status: order.order_type,
      destination:
        '' +
        order.OrderDetails[0].BusSchedule.departure_city +
        '-' +
        order.OrderDetails[0].BusSchedule.destination_city,
      price_detail: {
        bus_name_one: order.OrderDetails[0].BusSchedule.Bus.bus_name,
        bus_provider_one:
          order.OrderDetails[0].BusSchedule.BusProvider.provider_name,
        price_one: order.OrderDetails[0].BusSchedule.price,
        total: priceOne * passenger,
      },
    };
  }
  return result;
}

module.exports = { orderDetail };
