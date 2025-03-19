const Comment = require("../model/comment.model");
const Product = require('../model/product.model')
const User = require('../model/user.model')

const getComments = async (req, res) => {
  try {
    const { page, limit, sort, product_id, min_star, max_star } = req.query;
    
    const queryOptions = {
      include: [
        { model: Product },
        { model: User }
      ],
      where: {},
      order: [],
    };

    if (page && limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    if (sort) {
      queryOptions.order.push([sort, 'ASC']);
    } else {
      queryOptions.order.push(['star', 'ASC']);
    }

    if (product_id){
        queryOptions.where.product_id = product_id;
    } 
    if (min_star || max_star) {
      queryOptions.where.star = {};
      if (min_star){
        queryOptions.where.star[Op.gte] = parseInt(min_star);
      } 
      if (max_star){
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
    res.status(500).json({ message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: Product },
        { model: User }
      ]
    });
    if (!comment){
        return res.status(404).json({ error: "comment not found" });
    } 
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment){
        return res.status(404).json({ error: "comment not found" });
    } 
    await comment.update(req.body);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment){
        return res.status(404).json({ error: "comment not found" });
    } 
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
}