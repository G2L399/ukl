'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.order_list, { foreignKey: 'id', as: 'orderID' }),
      this.belongsTo(models.coffee, { foreignKey: 'id', as: 'coffeeID' })
    }
  }
  order_detail.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Mark 'id' as the primary key
      autoIncrement: true,
    },
    order_id: DataTypes.INTEGER,
    coffee_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'order_detail',
    tableName: 'order_detail',
  });
  return order_detail;
};