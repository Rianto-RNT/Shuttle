'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      departure_date: {
        type: Sequelize.DATEONLY,
      },
      return_date: {
        type: Sequelize.DATEONLY,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      ticket: {
        type: Sequelize.STRING,
      },
      order_status: {
        type: Sequelize.ENUM,
        values: ['success', 'pending', 'expired'],
      },
      total_passenger: {
        type: Sequelize.INTEGER,
        defaultValues: 1,
      },
      order_type: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  },
};
