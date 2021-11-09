'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.Passenger, {
        foreignKey: 'order_id',
      }),
        Order.hasOne(models.UserReview, {
          foreignKey: 'order_id',
        }),
        Order.hasMany(models.OrderDetail, {
          foreignKey: 'order_id',
        });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      date: DataTypes.DATE,
      departure_date: DataTypes.DATEONLY,
      return_date: DataTypes.DATEONLY,
      user_id: DataTypes.UUID,
      ticket: DataTypes.STRING,
      order_type: DataTypes.STRING,
      total_passenger: DataTypes.INTEGER,
      order_status: DataTypes.ENUM(['success', 'pending', 'expired']),
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
