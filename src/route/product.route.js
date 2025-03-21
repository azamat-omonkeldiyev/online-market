const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/",roleMiddleware(["seller", "admin"]), productController.createProduct);
router.patch("/:id",roleMiddleware(["seller", "admin","superadmin"]), productController.updateProduct);
router.delete("/:id",roleMiddleware(["seller", "admin"]), productController.deleteProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., price, name)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name (partial match)
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: integer
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: integer
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Laptop"
 *                   description: "High-performance laptop"
 *                   price: 1000
 *                   image: "http://example.com/laptop.jpg"
 *                   star: 5
 *                   category_id: 1
 *                   author_id: "550e8400-e29b-41d4-a716-446655440001"
 *                   createdAt: "2025-03-19T10:00:00Z"
 *                   updatedAt: "2025-03-19T10:00:00Z"
 *               total: 20
 *               page: 1
 *               totalPages: 2
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "Laptop"
 *               description: "High-performance laptop"
 *               price: 1000
 *               image: "http://example.com/laptop.jpg"
 *               star: 5
 *               category_id: 1
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Smartphone"
 *             description: "Latest model smartphone"
 *             price: 500
 *             image: "http://example.com/smartphone.jpg"
 *             category_id: 1
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440002"
 *               name: "Smartphone"
 *               description: "Latest model smartphone"
 *               price: 500
 *               image: "http://example.com/smartphone.jpg"
 *               star: 4
 *               category_id: 1
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Smartphone"
 *             description: "Updated latest model smartphone"
 *             price: 550
 *             image: "http://example.com/updated-smartphone.jpg"
 *             star: 5
 *             category_id: 1
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440002"
 *               name: "Updated Smartphone"
 *               description: "Updated latest model smartphone"
 *               price: 550
 *               image: "http://example.com/updated-smartphone.jpg"
 *               star: 5
 *               category_id: 1
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:05:00Z"
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

module.exports = router;