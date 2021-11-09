'use strict';

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Buses', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      bus_name: {
        type: Sequelize.STRING
      },
      air_conditioner: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      toilet: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      free_meal: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      charger: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      comforable_seat: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      wifi: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      photo_collection: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      seat: {
        type: Sequelize.INTEGER
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Buses');
  }
};