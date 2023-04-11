const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user.controller');

const { catchErrors } = require('../handlers/error.handler');

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Get user
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
 *     summary: Create new user
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
