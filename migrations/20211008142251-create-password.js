'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Passwords', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      password: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.UUID,
        foreignKey : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue  : new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue  : new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Passwords');
  }
};