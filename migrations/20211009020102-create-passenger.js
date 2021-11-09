'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Passengers', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      fullname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING
      },
      departure_seat: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      return_seat: {
        type: Sequelize.INTEGER,
        allowNull : true
      },
      order_id : {
        type : Sequelize.UUID,
        allowNull : true,
        foreignKey : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Passengers');
  }
};