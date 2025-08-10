/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for fetching summarized item data by phase
 */

/**
 * @swagger
 * /items/dashboard:
 *   post:
 *     summary: Get dashboard data showing all phases with items summary
 *     description: Returns a list of phases, each containing summarized item information such as bulk group ID, quantity, item name, and status.
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   phaseId:
 *                     type: string
 *                     description: ID of the phase
 *                   phaseName:
 *                     type: string
 *                     description: Name of the phase
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         bulkGroupId:
 *                           type: string
 *                           nullable: true
 *                           description: Group ID for bulk items
 *                         name:
 *                           type: string
 *                           nullable: true
 *                           description: Item name (from form data)
 *                         status:
 *                           type: string
 *                           description: Current status of the item
 *                           enum: [IN_PROGRESS, RETURNED, COMPLETED]
 *                         quantity:
 *                           type: integer
 *                           description: Total quantity of items in this group for the phase
 *       500:
 *         description: Internal server error
 */
