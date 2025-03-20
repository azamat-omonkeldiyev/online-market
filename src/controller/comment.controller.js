const Comment = require("../model/comment.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");
const {Op} = require("sequelize");
const commentValidationSchema = require("../validation/comment.validate");

const getComments = async (req, res) => {
  try {
    const { page, limit, sort, product_id, min_star, max_star } = req.query;

    const queryOptions = {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] },
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
      queryOptions.order.push(["star", "ASC"]);
    }

    if (product_id) {
      queryOptions.where.product_id = product_id;
    }
    if (min_star || max_star) {
      queryOptions.where.star = {};
      if (min_star) {
        queryOptions.where.star[Op.gte] = parseInt(min_star);
      }
      if (max_star) {
        queryOptions.where.star[Op.lte] = parseInt(max_star);
      }
    }

    const comments = await Comment.findAndCountAll(queryOptions);

    const response = {
      data: comments.rows,
      total: comments.count,
    };

    if (page && limit) {
      response.page = parseInt(page);
      response.totalPages = Math.ceil(comments.count / limit);
    }

    res.json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: User,attributes: ["id", "name"] },
      ],
    });
    if (!comment) {
      return res.status(404).json({ error: "comment not found" });
    }
    res.json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { error } = commentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let {...rest} = req.body;
    // console.log("salom", req.userId);
    const comment = await Comment.create({
      ...rest,
      author_id : req.userId
    });
    res.status(201).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { error } = commentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "comment not found" });
    }
    let {...rest} = req.body;
    await comment.update({
      ...rest,
      author_id: comment.author_id
    });
    res.json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "comment not found" });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};