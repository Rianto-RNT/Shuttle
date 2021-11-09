'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init(
    {
      user_id: DataTypes.UUID,
      title: DataTypes.ENUM(['Payment', 'Booking']),
      status: DataTypes.ENUM(['success', 'expired']),
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );
  return Notification;
};
