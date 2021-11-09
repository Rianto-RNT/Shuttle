'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      order_id: {
        type: Sequelize.UUID,
        foreignKey : true
      },
      payment_status: {
        type: Sequelize.ENUM,
        values : ['success','pending','expired']
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
    await queryInterface.dropTable('Payments');
  }
};