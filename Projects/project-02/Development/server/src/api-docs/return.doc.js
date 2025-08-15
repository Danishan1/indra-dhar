// docs/return.doc.js

/**
 * @swagger
 * tags:
 *   name: Returns
 *   description: APIs for handling return requests (single or bulk)
 */

/**
 * @swagger
 * /returns/pending:
 *   get:
 *     summary: Get all pending return requests for the current tenant
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending return requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReturnRequest'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /returns/{returnRequestId}/approve:
 *   post:
 *     summary: Approve a return request
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: returnRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the return request
 *     responses:
 *       200:
 *         description: Return request approved successfully
 *       400:
 *         description: Invalid return request ID
 *       404:
 *         description: Return request not found or already processed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /returns/{returnRequestId}/reject:
 *   post:
 *     summary: Reject a return request
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: returnRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the return request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: Return request rejected successfully
 *       400:
 *         description: Invalid return request ID
 *       404:
 *         description: Return request not found or already processed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReturnRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         tenantId:
 *           type: string
 *         itemIds:
 *           type: array
 *           items:
 *             type: string
 *         fromPhaseId:
 *           type: string
 *         toPhaseId:
 *           type: string
 *         requestedBy:
 *           type: string
 *         approvedBy:
 *           type: string
 *         note:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
