const Order = require("../model/order.model");
const OrderItem = require("../model/orderItem.model");
const User = require("../model/user.model");

// Order yaratish (Create)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const user_id  = "42eb12f0-a6b5-49f4-8014-cb462cf74872";
    if (!user_id) return res.status(400).json({ message: "User ID is required" });

    const userExists = await User.findByPk(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const order = await Order.create({ user_id });

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      count: item.count,
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order, orderItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Barcha buyurtmalarni olish (Read All) + Pagination + Filter by user_id
const getAllOrders = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;

    const whereCondition = user_id ? { user_id } : {};

    const orders = await Order.findAndCountAll({
      where: whereCondition,
      include: [{ model: User }, { model: OrderItem }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.status(200).json({
      total: orders.count,
      page: parseInt(page),
      data: orders.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// ID bo‘yicha bitta buyurtmani olish (Read One)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, { include: [User, OrderItem] });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buyurtmani yangilash (Update)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (items && Array.isArray(items)) {
      await OrderItem.destroy({ where: { order_id: id } });

      const newOrderItems = items.map((item) => ({
        order_id: id,
        product_id: item.product_id,
        count: item.count,
      }));

      await OrderItem.bulkCreate(newOrderItems);
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buyurtmani o‘chirish (Delete)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await OrderItem.destroy({ where: { order_id: id } });
    await order.destroy();

    res.json({ message: "Order and its items deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
