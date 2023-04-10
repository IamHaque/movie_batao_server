const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user.controller');

const { catchErrors } = require('../handlers/error.handler');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       _id:
 *         type: string
 *         example: 6432a2ea9f31dd86c09a6cac
 *       email:
 *         type: string
 *         example: example@email.com
 *       username:
 *         type: string
 *         example: John Doe
 *       provider:
 *         type: string
 *         example: google
 *       collections:
 *         type: array
 *         example: []
 *       favorites:
 *         type: array
 *         example: []
 *       createdAt:
 *         type: string
 *         example: 2023-04-09T11:35:06.299Z
 *       updatedAt:
 *         type: string
 *         example: 2023-04-09T11:35:06.299Z
 *
 *   ServerError:
 *     properties:
 *       message:
 *         type: string
 *         example: error fetching user
 *       status:
 *         type: string
 *         example: 500
 */

/**
 * @swagger
 * /user/getByEmail:
 *   post:
 *     summary: Retrieve user data
 *     description: Returns user data for the provided email from the database
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email of the user
 *                 example: example@email.com
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/getByEmail', catchErrors(UserController.getUser));

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with provided data in the database
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 description: user email
 *                 example: example@email.com
 *               username:
 *                 type: string
 *                 description: username
 *                 example: John Doe
 *               provider:
 *                 type: string
 *                 description: user provider
 *                 example: google
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/create', catchErrors(UserController.createUser));

module.exports = router;
