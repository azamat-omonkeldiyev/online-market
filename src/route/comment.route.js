const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment.controller");

router.get("/", commentController.getComments);
router.get("/:id", commentController.getComment);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
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
 *         description: Field to sort by (e.g., star)
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by product ID
 *       - in: query
 *         name: min_star
 *         schema:
 *           type: integer
 *         description: Minimum star rating filter
 *       - in: query
 *         name: max_star
 *         schema:
 *           type: integer
 *         description: Maximum star rating filter
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 1
 *                   message: "Great product!"
 *                   star: 5
 *                   product_id: "550e8400-e29b-41d4-a716-446655440000"
 *                   author_id: "550e8400-e29b-41d4-a716-446655440001"
 *                   createdAt: "2025-03-19T10:00:00Z"
 *                   updatedAt: "2025-03-19T10:00:00Z"
 *               total: 10
 *               page: 1
 *               totalPages: 1
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               message: "Great product!"
 *               star: 5
 *               product_id: "550e8400-e29b-41d4-a716-446655440000"
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             message: "Amazing quality!"
 *             star: 4
 *             product_id: "550e8400-e29b-41d4-a716-446655440000"
 *             author_id: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               message: "Amazing quality!"
 *               star: 4
 *               product_id: "550e8400-e29b-41d4-a716-446655440000"
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             message: "Updated: Really good!"
 *             star: 5
 *             product_id: "550e8400-e29b-41d4-a716-446655440000"
 *             author_id: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Comment updated
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               message: "Updated: Really good!"
 *               star: 5
 *               product_id: "550e8400-e29b-41d4-a716-446655440000"
 *               author_id: "550e8400-e29b-41d4-a716-446655440001"
 *               createdAt: "2025-03-19T10:00:00Z"
 *               updatedAt: "2025-03-19T10:05:00Z"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       204:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

module.exports = router;