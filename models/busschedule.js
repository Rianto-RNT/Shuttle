'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BusSchedule.hasMany(models.OrderDetail, {
        foreignKey: 'bus_schedule_id',
      });
      BusSchedule.belongsTo(models.Bus, {
        foreignKey: 'bus_id',
      });
      BusSchedule.belongsTo(models.BusProvider, {
        foreignKey: 'bus_provider_id',
      });
      BusSchedule.belongsTo(models.Shuttle, {
        foreignKey: 'departure_shuttle_id',
      });
      BusSchedule.belongsTo(models.Shuttle, {
        foreignKey: 'arrival_shuttle_id',
      });
    }
  }
  BusSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      departure_time: DataTypes.TIME,
      arrival_time: DataTypes.TIME,
      departure_shuttle_id: DataTypes.UUID,
      arrival_shuttle_id: DataTypes.UUID,
      bus_id: DataTypes.UUID,
      bus_provider_id: DataTypes.UUID,
      destination_city: DataTypes.STRING,
      departure_city: DataTypes.STRING,
      arrival_shuttle: DataTypes.STRING,
      departure_shuttle: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'BusSchedule',
    }
  );
  return BusSchedule;
};
