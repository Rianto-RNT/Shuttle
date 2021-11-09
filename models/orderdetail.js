'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
      OrderDetail.belongsTo(models.BusSchedule, {
        foreignKey: 'bus_schedule_id',
      });
      OrderDetail.hasOne(models.UserReview, {
        foreignKey: 'order_detail_id',
      });
    }
  }
  OrderDetail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      bus_schedule_id: DataTypes.UUID,
      order_id: DataTypes.UUID,
      departure_date: DataTypes.DATEONLY,
      return_date: DataTypes.DATEONLY,
      check_in_status : DataTypes.ENUM(['success','pending','expired']),
    },
    {
      sequelize,
      modelName: 'OrderDetail',
    }
  );
  return OrderDetail;
};
