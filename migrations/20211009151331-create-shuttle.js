'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shuttles', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      city: {
        type: Sequelize.STRING
      },
      shuttle_name : {
        type : Sequelize.STRING
      },
      user_id : {
        type : Sequelize.UUID
      },
      address: {
        type: Sequelize.STRING
      },
      total_bus: {
        type: Sequelize.INTEGER
      },
      published: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Shuttles');
  }
};