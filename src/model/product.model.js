const { db, DataTypes } = require("../config/db");
const Category = require("./category.model");
const User = require("./user.model");
const Comment = require("./comment.model");

const Product = db.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
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

Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(User, { foreignKey: "author_id" });
Product.hasMany(Comment, { foreignKey: "product_id" });

module.exports = Product;
