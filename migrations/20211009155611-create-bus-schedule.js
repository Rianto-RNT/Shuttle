'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusSchedules', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      departure_time: {
        type: Sequelize.TIME
      },
      arrival_time: {
        type: Sequelize.TIME
      },
      departure_shuttle_id: {
        type: Sequelize.UUID,
        foreignKey:true
      },
      arrival_shuttle_id: {
        type: Sequelize.UUID,
        foreignKey:true
      },
      bus_id: {
        type: Sequelize.UUID,
        foreignKey:true
      },
      bus_provider_id: {
        type: Sequelize.UUID,
        foreignKey:true
      },
      destination_city: {
        type: Sequelize.STRING
      },
      departure_city: {
        type: Sequelize.STRING
      },
      arrival_shuttle: {
        type: Sequelize.STRING
      },
      departure_shuttle: {
        type: Sequelize.STRING
      },
      price : {
        type : Sequelize.INTEGER
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
    await queryInterface.dropTable('BusSchedules');
  }
};