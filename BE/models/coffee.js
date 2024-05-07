'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coffee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_detail, { foreignKey: 'coffee_id', as: 'coffeeID' });

    }
  }
  coffee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Mark 'id' as the primary key
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.BLOB,
    ImageName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'coffee',
    tableName: 'coffee',
  });
  return coffee;
};