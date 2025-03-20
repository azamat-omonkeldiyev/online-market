const express = require("express");
const { createRegion, getAllRegions, getRegionById, updateRegion, deleteRegion } = require("../controller/region.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management APIs
 */

/**
 * @swagger
 * /regions:
 *   post:
 *     summary: Create a new region
 *     tags: [Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tashkent"
 *     responses:
 *       201:
 *         description: Region created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", createRegion);

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Get all regions
 *     tags: [Regions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of records per page (default: 10)"
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get("/", getAllRegions);

/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Get region by ID
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region data
 *       404:
 *         description: Region not found
 */
router.get("/:id", getRegionById);

/**
 * @swagger
 * /regions/{id}:
 *   patch:
 *     summary: Update a region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Samarkand"
 *     responses:
 *       200:
 *         description: Region updated
 *       404:
 *         description: Region not found
 */
router.patch("/:id", updateRegion);

/**
 * @swagger
 * /regions/{id}:
 *   delete:
 *     summary: Delete a region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *       404:
 *         description: Region not found
 */
router.delete("/:id", deleteRegion);

module.exports = router;
