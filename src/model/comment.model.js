const { db, DataTypes } = require("../config/db");
const Product = require("./product.model");
const User = require("./user.model");

const Comment = db.define("comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Comment.belongsTo(Product, { foreignKey: "product_id" });
Comment.belongsTo(User, { foreignKey: "author_id" });

module.exports = Comment;
