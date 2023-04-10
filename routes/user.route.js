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
 *   email:
 *     type: string
 *     example: example@email.com
 *     description: user email
 *   username:
 *     type: string
 *     example: John Doe
 *     description: username
 *   providerId:
 *     type: string
 *     example: 6432a2ea9f31dd8
 *     description: user provider ID
 *   provider:
 *     type: string
 *     example: google
 *     description: user provider
 *
 *   User:
 *     properties:
 *       _id:
 *         type: string
 *         example: 6432a2ea9f31dd86c09a6cac
 *       email:
 *         $ref: '#/definitions/email'
 *       username:
 *         $ref: '#/definitions/username'
 *       providerId:
 *         $ref: '#/definitions/providerId'
 *       provider:
 *         $ref: '#/definitions/provider'
 *       createdAt:
 *         type: string
 *         example: 2023-04-09T11:35:06.299Z
 *       updatedAt:
 *         type: string
 *         example: 2023-04-09T11:35:06.299Z
 *       token:
 *         type: string
 *         example: eyJhbGciOiJIUzI1
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
 * /user/login:
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
 *             required:
 *               - email
 *               - providerId
 *             properties:
 *               email:
 *                 $ref: '#/definitions/email'
 *               providerId:
 *                 $ref: '#/definitions/providerId'
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
router.post('/login', catchErrors(UserController.login));

/**
 * @swagger
 * /user/register:
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
 *               - providerId
 *             properties:
 *               email:
 *                 $ref: '#/definitions/email'
 *               username:
 *                 $ref: '#/definitions/username'
 *               providerId:
 *                 $ref: '#/definitions/providerId'
 *               provider:
 *                 $ref: '#/definitions/provider'
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
router.post('/register', catchErrors(UserController.register));

module.exports = router;
