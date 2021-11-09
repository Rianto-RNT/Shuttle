'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BusProvider.hasMany(models.BusSchedule, {
        foreignKey: 'bus_provider_id',
      });
    }
  }
  BusProvider.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      provider_name: DataTypes.STRING,
      city: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      website: DataTypes.STRING,
      facebook: DataTypes.STRING,
      instagram: DataTypes.STRING,
      twitter: DataTypes.STRING,
      photo: DataTypes.STRING,
      banking_name: DataTypes.STRING,
      banking_account: DataTypes.STRING,
      tax_id: DataTypes.STRING,
      ktp_owner: DataTypes.STRING,
      user_id: DataTypes.UUID,
      owner_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'BusProvider',
    }
  );
  return BusProvider;
};
