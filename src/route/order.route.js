const express = require("express");
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require("../controller/order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
