const { db, DataTypes } = require("../config/db");
const User = require("./user.model");

const Order = db.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });

module.exports = Order;
