const { Op } = require("sequelize");
const Category = require("../model/category.model");
const Product = require("../model/product.model");
const categoryValidationSchema = require("../validation/category.validate");

const getCategories = async (req, res) => {
  try {
    const { page, limit, sort, name } = req.query;
    const queryOptions = {
      include: [{ model: Product }],
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
      queryOptions.order.push(["name", "ASC"]);
    }

    if (name) {
      queryOptions.where.name = { [Op.like]: `%${name}%` };
    }

    const categories = await Category.findAndCountAll(queryOptions);

    const response = {
      data: categories.rows,
      total: categories.count,
    };

    if (page && limit) {
      response.page = parseInt(page);
      response.totalPages = Math.ceil(categories.count / limit);
    }

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    await category.destroy();
    res.status(200).json({message: "deleted category"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
