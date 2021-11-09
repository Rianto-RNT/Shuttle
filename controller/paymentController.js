const {
  Payment,
  Order,
  Passenger,
  BusSchedule,
  BusProvider,
  Bus,
  OrderDetail,
  User,
} = require('../models');
const { midtransSnap } = require('../util/midtrans');
const moment = require('moment');
const { orderDetail } = require('../helper/orderDetail');
const { findUserId } = require('./orderController');
const { createNotification } = require('./notificationController');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

async function createPayment(req, res) {
  try {
    const { order_id } = req.query;
    const detail = await orderDetail(order_id);
    const [result, created] = await Payment.findOrCreate({
      where: {
        order_id: order_id,
      },
      defaults: {
        order_id: order_id,
        payment_status: 'pending',
      },
    });
    if (!created)
      return res
        .status(400)
        .json({ status: 'failed', message: 'this order has a payment before' });
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: detail.price_detail.total,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = midtransSnap.createTransaction(parameter);
    const redirectUrl = await transaction;

    return res.status(200).json({
      order_id: order_id,
      payment_id: result.id,
      data: redirectUrl,
      message: 'Silahkan lanjutkan ke link berikut utk melakukan pembayaran',
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

async function showPaymentByStatus(req, res) {
  try {
    const { status } = req.query;
    let payment;
    if (status) {
      payment = await Payment.findAll({
        where: {
          payment_status : status,
        },
        include: [
          {
            model: Order,
            where: {
              user_id: req.user.id,
            },
          },
        ],
      });
    } else {
      payment = await Payment.findAll({
        include: [
          {
            model: Order,
            where: {
              user_id: req.user.id,
            },
          },
        ],
      });
    }

    if (payment.length == 0)
      return res.status(400).json({
        status: 'failed',
        message: `Order with status '${status}'  is not found`,
        data: [],
      });
    const result = [];
    for (let i = 0; i < payment.length; i++) {
      const detail = await orderDetail(payment[i].order_id);
      result.push({
        payment_id: payment[i].id,
        order_id: detail.orderId,
        amount_to_pay: detail.price_detail.total,
        destination: detail.destination,
        payment_status: payment[i].payment_status,
        order_type: payment[i].Order.order_type,
      });
    }
    return res.status(200).json({ status: 'success', data: result });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured ', error: e });
  }
}

async function showPaymentDetail(req, res) {
  try {
    let result;
    const { order_id } = req.query;
    const passenger = await Passenger.findAll({
      where: {
        order_id: order_id,
      },
    });
    const payment = await Payment.findOne({
      where: {
        order_id: order_id,
      },
      include: [
        {
          model: Order,
          where: {
            user_id: req.user.id,
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
        },
      ],
    });
    const due = payment.createdAt;
    const h = due.getHours() + 1;
    due.setHours(h);
    const po = payment.Order;
    const dep_schedule = payment.Order.OrderDetails[0].BusSchedule;

    if (payment.Order.order_type == 'RoundTrip') {
      const ret_schedule = payment.Order.OrderDetails[1].BusSchedule;
      result = {
        order_date: po.date,
        order_id: po.id,
        due_date: moment(due).format('MMMM Do YYYY, h:mm:ss a'),
        total_passenger: po.total_passenger,
        payment_status: payment.payment_status,
        price_detail: {
          departure_provider: dep_schedule.BusProvider.provider_name,
          departure_price: dep_schedule.price,
          return_provider: dep_schedule.BusProvider.provider_name,
          return_price: dep_schedule.price,
          total_price:
            (dep_schedule.price + ret_schedule.price) * po.total_passenger,
        },
        departure_bus_name: dep_schedule.Bus.bus_name,
        departure_bus_provider: dep_schedule.BusProvider.provide_name,
        departure_shuttle: [
          dep_schedule.departure_shuttle,
          dep_schedule.departure_city,
        ],
        departure_date: dep_schedule.departure_date,
        departure_time: [
          dep_schedule.departure_time,
          dep_schedule.arrival_time,
        ],
        return_bus_name: ret_schedule.Bus.bus_name,
        return_bus_provider: ret_schedule.BusProvider.provider_name,
        return_shuttle: [
          ret_schedule.departure_shuttle,
          ret_schedule.destination_city,
        ],
        return_date: ret_schedule.return_date,
        return_time: [ret_schedule.departure_time, ret_schedule.arrival_time],
        passengers: passenger,
      };
    } else if (payment.Order.order_type == 'OneWay') {
      result = {
        order_date: po.date,
        order_id: po.id,
        due_date: moment(due).format('MMMM Do YYYY, h:mm:ss a'),
        total_passenger: po.total_passenger,
        payment_status: payment.payment_status,
        price_detail: {
          departure_provider: dep_schedule.BusProvider.provider_name,
          departure_price: dep_schedule.price,
          total_price: dep_schedule.price * po.total_passenger,
        },
        departure_bus_name: dep_schedule.Bus.bus_name,
        departure_bus_provider: dep_schedule.BusProvider.provide_name,
        departure_shuttle: [
          dep_schedule.departure_shuttle,
          dep_schedule.departure_city,
        ],
        departure_date: dep_schedule.depature_date,
        departure_time: [
          dep_schedule.departure_time,
          dep_schedule.arrival_time,
        ],
        passengers: passenger,
      };
    }
    return res.status(200).json({ status: 'success', data: result });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', error: e, message: 'Error has occured !' });
  }
}

async function paymentHandling(req, res) {
  try {
    const transaction = await midtransSnap.transaction.notification(req.body);
    const orderId = transaction.order_id;
    const transactionStatus = transaction.transaction_status;
    const fraudStatus = transaction.fraud_status;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        // TODO set transaction status on your database to 'challenge'
        // and response with 200 OK
        await Order.update(
          { order_status: 'challenge' },
          { where: { id: orderId } }
        );
        await Payment.update(
          { payment_status: 'challenge' },
          { where: { order_id: orderId } }
        );
      } else if (fraudStatus == 'accept') {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        await Order.update(
          { order_status: 'success' },
          { where: { id: orderId } }
        );
        await Payment.update(
          { payment_status: 'success' },
          { where: { order_id: orderId } }
        );
      }
    } else if (transactionStatus == 'settlement') {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      await Order.update(
        { order_status: 'success' },
        { where: { id: orderId } }
      );
      await Payment.update(
        { payment_status: 'success' },
        { where: { order_id: orderId } }
      );
      const order = await Order.findOne({
        where: {
          id: orderId,
        },
      });
      const user = await User.findOne({
        where: {
          id: order.user_id,
        },
      });
      await createNotification({
        user_id: user.id,
        title: 'Payment',
        status: 'success',
        description:
          "Your payment is success , and now you're ready to experience journey with us !",
      });

      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'shuttlefinalproject@gmail.com',
          pass: '@Secret123',
        },
      });
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve('./views'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./views'),
      };
      transporter.use('compile', hbs(handlebarOptions));
      const mailOption = {
        from: 'shuttlefinalproject@gmail.com',
        to: user.email,
        subject: 'Ticket Number !',
        template: 'tiket',
        context: {
          ticket: order.ticket,
        },
      };
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        }
        console.log('Message sent : ');
      });
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      await Order.update(
        { order_status: 'expired' },
        { where: { id: orderId } }
      );
      await Payment.update(
        { payment_status: 'expired' },
        { where: { order_id: orderId } }
      );
      await createNotification({
        user_id: await findUserId(orderId),
        title: 'Payment',
        status: 'expired',
        description: 'Your payment is expired, please booking once again !',
      });
    } else if (transactionStatus == 'pending') {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      await Order.update(
        { order_status: 'pending' },
        { where: { id: orderId } }
      );
      await Payment.update(
        { payment_status: 'pending' },
        { where: { order_id: orderId } }
      );
    }
    console.log(transaction);
    return res.sendStatus(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = {
  createPayment,
  paymentHandling,
  showPaymentDetail,
  showPaymentByStatus,
};
