'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        unique : true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone : {
        type : Sequelize.STRING,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue : "https://i.pinimg.com/474x/cd/22/1e/cd221ed949586078a63d5aad2122a205.jpg"
      },
      roles : {
        type : Sequelize.ENUM,
        values : ["user" , "bus_provider"]
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
    await queryInterface.dropTable('Users');
  }
};