'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passenger.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
    }
  }
  Passenger.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      age: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      departure_seat: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      return_seat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Passenger',
    }
  );
  return Passenger;
};
