const { db, DataTypes } = require("../config/db");
const Product = require("./product.model");

const Category = db.define("category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Category.hasMany(Product, { foreignKey: "category_id" });

module.exports = Category;
