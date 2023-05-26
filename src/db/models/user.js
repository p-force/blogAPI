const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      this.hasOne(models.Refresh, {
        foreignKey: 'userId',
      });
      this.hasMany(models.BlogPost, {
        foreignKey: 'userId',
      });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
