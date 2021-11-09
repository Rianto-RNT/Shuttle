'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserReview.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
      UserReview.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      UserReview.belongsTo(models.OrderDetail, {
        foreignKey: 'order_detail_id',
      });
    }
  }
  UserReview.init(
    {
      order_id: DataTypes.UUID,
      rating: DataTypes.INTEGER,
      review: DataTypes.STRING,
      user_id: DataTypes.UUID,
      order_detail_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'UserReview',
    }
  );
  return UserReview;
};
