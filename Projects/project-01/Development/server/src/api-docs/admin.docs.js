/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs (phases, users, forms, dashboard)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Phase:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Packaging"
 *         order:
 *           type: integer
 *           example: 2
 *         description:
 *           type: string
 *           example: "Items are packaged here"
 *         users:
 *           type: array
 *           items:
 *             type: string
 *             example: "64fddf2332a4b0a1b1c2d3e4"
 *         tenantId:
 *           type: string
 *           example: "64fddf2332a4b0a1b1c2d3e4"
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "StrongP@ss123"
 *         role:
 *           type: string
 *           enum: [admin, phase_head, operator]
 *           example: "phase_head"
 *         phases:
 *           type: array
 *           items:
 *             type: string
 *             example: "64fddf2332a4b0a1b1c2d3e4"
 *         tenantId:
 *           type: string
 *           example: "64fddf2332a4b0a1b1c2d3e4"
 *     FormTemplate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Initial Item Intake Form"
 *         fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Product Name"
 *               fieldType:
 *                 type: string
 *                 enum: [small_text, large_text, image, dropdown]
 *                 example: "dropdown"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Option A"
 *               required:
 *                 type: boolean
 *                 example: true
 *         tenantId:
 *           type: string
 *           example: "64fddf2332a4b0a1b1c2d3e4"
 */

/**
 * @swagger
 * /admin/phases:
 *   post:
 *     summary: Create a new phase
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Phase'
 *     responses:
 *       201:
 *         description: Phase created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /admin/phases/{id}:
 *   put:
 *     summary: Update an existing phase
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Phase ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Phase'
 *     responses:
 *       200:
 *         description: Phase updated successfully
 *   delete:
 *     summary: Delete a phase
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Phase ID
 *     responses:
 *       200:
 *         description: Phase deleted successfully
 */

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /admin/forms:
 *   post:
 *     summary: Create a dynamic form template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormTemplate'
 *     responses:
 *       201:
 *         description: Form template created successfully
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get global dashboard of all phases
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
