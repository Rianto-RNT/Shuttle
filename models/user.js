'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Password, {
        foreignKey: 'user_id',
      });
      User.hasMany(models.UserReview, {
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      profile_picture: DataTypes.STRING,
      roles: DataTypes.ENUM(['user', 'bus_provider', 'admin']),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
