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
router.get("/", dreamController.getDreams); // 어떤 URL이 어떤 controller 함수로 갈지 결정.

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

// frontend의 dreamCreate.jsx에서 createDream api를 호출함.
// 그 post 요청은 frontend의 dreamApi를 통해, 이 곳 backend의 dreamRoutes로 오게 되었고
// 이 라우터는 그 요청을 dreamController로 넘긴다.

// front의 dreamApi와 back의 dreamRoutes가 딱 맞닿아있는 구조.
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

/**
 * @swagger
 * /api/dreams/{id}/summary:
 *   post:
 *     summary: Generate AI summary for a dream
 *     tags:
 *       - Dreams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dream ID
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dream_id:
 *                   type: integer
 *                 ai_summary:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dream not found
 *       500:
 *         description: Failed to summarize dream
 */
router.post("/:id/summary", dreamController.summarizeDream);

module.exports = router;