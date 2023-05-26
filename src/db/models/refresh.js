const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Refresh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Refresh.init({
    refreshToken: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Refresh',
  });
  return Refresh;
};
