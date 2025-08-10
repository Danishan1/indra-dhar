/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new tenant user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantName
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               tenantName:
 *                 type: string
 *                 example: "Acme Corp"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *               role:
 *                 type: string
 *                 enum: [admin, phase_head, operator]
 *                 example: "admin"
 *               phaseId:
 *                 type: string
 *                 example: "64c9f9b5f1a2a3c123456789"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User registered successfully
 *               data:
 *                 userId: 64c9f9b5f1a2a3c123456789
 *                 tenantId: 64c9f9b5f1a2a3c987654321
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantName
 *               - email
 *               - password
 *             properties:
 *               tenantName:
 *                 type: string
 *                 example: "Acme Corp"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: "<JWT_TOKEN>"
 *               user:
 *                 id: 64c9f9b5f1a2a3c123456789
 *                 name: John Doe
 *                 email: john@example.com
 *                 role: admin
 */
