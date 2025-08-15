/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API for managing items and bulk items
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a single item or bulk items
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isBulkCountBased:
 *                 type: boolean
 *                 description: Whether this is a bulk count-based creation
 *               quantity:
 *                 type: integer
 *                 description: Number of items to create if bulk count-based
 *               trackingId:
 *                 type: string
 *                 description: Tracking ID for single item creation
 *               bulkGroupId:
 *                 type: string
 *                 description: Group ID for bulk items
 *               formData:
 *                 type: object
 *                 description: Additional item data
 *               templateId:
 *                 type: string
 *                 description: ID of the template to associate
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Image URLs
 *     responses:
 *       201:
 *         description: Item(s) created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items with optional filters
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: phaseId
 *         schema:
 *           type: string
 *         description: Filter by phase ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: bulkGroupId
 *         schema:
 *           type: string
 *         description: Filter by bulk group ID
 *     responses:
 *       200:
 *         description: List of items
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item details
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /items/{id}/move-forward:
 *   post:
 *     summary: Move an item or bulk to another phase
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bulk group ID or item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toPhaseId:
 *                 type: string
 *                 description: Phase ID to move to
 *               quantity:
 *                 type: integer
 *                 description: Quantity to move (for bulk)
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Item IDs (for ID-based movement)
 *     responses:
 *       200:
 *         description: Movement successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: No items found to move
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /items/{id}/move-backward:
 *   post:
 *     summary: Request a return for an item or bulk
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bulk group ID or item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toPhaseId:
 *                 type: string
 *                 description: Phase ID to return to
 *               note:
 *                 type: string
 *                 description: Additional note for return
 *               quantity:
 *                 type: integer
 *                 description: Quantity to return (for bulk)
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Item IDs (for ID-based return)
 *     responses:
 *       201:
 *         description: Return request created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: No items found to return
 *       500:
 *         description: Internal server error
 */
