const { Bus } = require('../models');

async function createBus(bus) {
  const {
    bus_name,
    air_conditioner,
    toilet,
    free_meal,
    charger,
    comfortable_seat,
    wifi,
    photo_collection,
    seat,
    published,
  } = bus;
  const result = await Bus.create({
    bus_name,
    air_conditioner,
    toilet,
    free_meal,
    charger,
    comfortable_seat,
    wifi,
    photo_collection,
    seat,
    published,
  });
  return result;
}

module.exports = { createBus };
