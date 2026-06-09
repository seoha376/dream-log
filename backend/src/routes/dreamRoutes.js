const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dreamController = require("../controllers/dreamController");

router.use(authMiddleware);
/**
 * @swagger
 * /api/dreams:
 *   get:
 *     summary: Get dreams
 *     description: Get dreams for the logged-in user. Can filter by tag or keyword.
 *     tags:
 *       - Dreams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter dreams by tag_id
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: Search dreams by title or content
 *     responses:
 *       200:
 *         description: Dreams fetched successfully
 *       401:
 *         description: Authorization token is required
 *       500:
 *         description: Failed to get dreams
 */
router.get("/", dreamController.getDreams);


/**
 * @swagger
 * /api/dreams/{id}:
 *   get:
 *     summary: Get a single dream
 *     tags: [Dreams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dream returned successfully
 *       404:
 *         description: Dream not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", dreamController.getDream);

/**
 * @swagger
 * /api/dreams:
 *   post:
 *     summary: Create a new dream
 *     tags: [Dreams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - dream_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: Flying over the city
 *               content:
 *                 type: string
 *                 example: I dreamed that I was flying above tall buildings.
 *               dream_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-08
 *     responses:
 *       201:
 *         description: Dream created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Authorization token is required
 */
router.post("/", dreamController.createDream);


/**
 * @swagger
 * /api/dreams/{id}:
 *   patch:
 *     summary: Update a dream
 *     tags: [Dreams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               dream_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Dream updated successfully
 *       404:
 *         description: Dream not found
 */
router.patch("/:id", dreamController.updateDream);


/**
 * @swagger
 * /api/dreams/{id}:
 *   delete:
 *     summary: Delete a dream
 *     tags: [Dreams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dream deleted successfully
 *       404:
 *         description: Dream not found
 */
router.delete("/:id", dreamController.deleteDream);


/**
 * @swagger
 * /api/dreams/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite status
 *     tags: [Dreams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite status updated
 *       404:
 *         description: Dream not found
 */
router.patch("/:id/favorite", dreamController.toggleFavorite);

module.exports = router;