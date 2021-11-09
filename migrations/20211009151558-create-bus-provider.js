'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusProviders', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      provider_name: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      twitter : {
        type : Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING,
        defaultValue : "https://i.pinimg.com/474x/cd/22/1e/cd221ed949586078a63d5aad2122a205.jpg"
      },
      banking_name: {
        type: Sequelize.STRING
      },
      banking_account: {
        type: Sequelize.STRING
      },
      tax_id: {
        type: Sequelize.STRING
      },
      ktp_owner: {
        type: Sequelize.STRING
      },
      owner_picture: {
        type: Sequelize.STRING,
        defaultValue : "https://i.pinimg.com/474x/cd/22/1e/cd221ed949586078a63d5aad2122a205.jpg"
      },
      user_id : {
        type : Sequelize.UUID
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
    await queryInterface.dropTable('BusProviders');
  }
};