const Product = require("../model/product.model");
const Category = require("../model/category.model");
const User = require("../model/user.model");
const Comment = require("../model/comment.model");
const { Op } = require("sequelize");
const productValidationSchema = require("../validation/product.validate");

const getProducts = async (req, res) => {
  try {
    const { page, limit, sort, category_id, name, min_price, max_price } = req.query;

    const queryOptions = {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: User , attributes: ["id", "name"]}
      ],
      where: {},
      order: [],
    };

    if (page && limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    if (sort) {
      queryOptions.order.push([sort, "ASC"]);
    } else {
      queryOptions.order.push(["price", "ASC"]);
    }

    if (category_id) {
      queryOptions.where.category_id = category_id;
    }
    if (name) {
      queryOptions.where.name = { [Op.like]: `%${name}%` };
    }
    if (min_price || max_price) {
      queryOptions.where.price = {};
      if (min_price) {
        queryOptions.where.price[Op.gte] = parseInt(min_price);
      }
      if (max_price) {
        queryOptions.where.price[Op.lte] = parseInt(max_price);
      }
    }

    const products = await Product.findAndCountAll(queryOptions);

    const productIds = await products.rows.map((product) => product.id)

    const comments = await Comment.findAll({
        where: {product_id: { [Op.in]: productIds}},
        attributes: ["product_id", "star"],
    })

    const starMap = {}
    comments.forEach((comment) => {
        const productId = comment.product_id
        if(!starMap[productId]){
            starMap[productId] = {total: 0, count: 0}
        }
        starMap[productId].total += comment.star
        starMap[productId].count += 1
    })

    const updatedProducts = products.rows.map((product) => {
        const prd = product.toJSON()
        const avgData = starMap[prd.id]
        prd.star = avgData ? (avgData.total / avgData.count).toFixed(1) : null
        return prd
    })

    const response = {
      data: updatedProducts,
      total: products.count,
    };

    if (page && limit) {
      response.page = parseInt(page);
      response.totalPages = Math.ceil(products.count / limit);
    }

    res.json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category,attributes: ["id", "name"] },
        { model: User,attributes: ["id", "name"] }
      ],
    });
    if (!product) return res.status(404).json({ error: "product not found" });

    const comments = await Comment.findAll({
        where: {product_id: req.params.id},
        attributes: ["star"],
    })
    let averageStar = 0
    if(comments.length > 0){
        const total = comments.reduce((sum, comment) => sum + comment.star, 0)
        averageStar = (total / comments.length).toFixed(1)
    }
    product.star = averageStar
    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log(req.userId)
    let {...rest} = req.body;
    const product = await Product.create({
      ...rest,
      star: 0,
      author_id: req.userId
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const product = await Product.findByPk(req.params.id);
    let {...rest} = req.body;
    if (!product) return res.status(404).json({ error: "product not found" });
    await product.update({
      ...rest,
      author_id: product.author_id
    });
    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "product not found" });
    console.log(product);
    await product.destroy();
    res.status(200).json({message: "deleted successfully"});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};