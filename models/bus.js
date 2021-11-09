'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bus.hasMany(models.BusSchedule, {
        foreignKey: 'bus_id',
      });
    }
  }
  Bus.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      bus_name: DataTypes.STRING,
      air_conditioner: DataTypes.BOOLEAN,
      toilet: DataTypes.BOOLEAN,
      free_meal: DataTypes.BOOLEAN,
      charger: DataTypes.BOOLEAN,
      comforable_seat: DataTypes.BOOLEAN,
      wifi: DataTypes.BOOLEAN,
      photo_collection: DataTypes.ARRAY(DataTypes.STRING),
      seat: DataTypes.INTEGER,
      published: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Bus',
    }
  );
  return Bus;
};
