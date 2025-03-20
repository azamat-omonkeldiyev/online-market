const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");
const roleMiddleware = require("../rolemiddleware/roleAuth");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post("/",roleMiddleware(["admin"]), categoryController.createCategory);
router.patch("/:id",roleMiddleware(["admin", "superadmin"]), categoryController.updateCategory);
router.delete("/:id",roleMiddleware(["admin"]), categoryController.deleteCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Field to sort by (e.g., name)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by category name (partial match)
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 1
 *                   name: "Electronics"
 *                   createdAt: "2025-03-19T10:00:00Z"
 *                   updatedAt: "2025-03-19T10:00:00Z"
 *               total: 5
 *               page: 1
 *               totalPages: 1
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "Electronics"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Books"
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               name: "Books"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Books"
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               name: "Updated Books"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:05:00Z"
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

module.exports = router;