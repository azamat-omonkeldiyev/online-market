const { db, DataTypes } = require("../config/db");
const Order = require("./order.model");
const Product = require("./product.model");

const OrderItem = db.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

// OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

module.exports = OrderItem;
