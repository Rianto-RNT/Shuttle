'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderDetails', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      bus_schedule_id: {
        type: Sequelize.UUID,
        foreignKey : true
      },
      order_id: {
        type: Sequelize.UUID,
        foreignKey:true
      },
      departure_date: {
        type : Sequelize.DATEONLY
      },
      return_date : {
        type : Sequelize.DATEONLY
      },
      check_in_status: {
        type: Sequelize.ENUM,
        values: ['success', 'pending', 'expired'],
        defaultValue: 'pending',
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
    await queryInterface.dropTable('OrderDetails');
  }
};