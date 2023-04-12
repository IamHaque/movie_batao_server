const express = require('express');

const router = express.Router();
const MovieController = require('../controllers/media.controller');

const { catchErrors } = require('../handlers/error.handler');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /category/{category}:
 *   get:
 *     summary: Get medias by category
 *     description: Returns a list of media of provided category
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaTypeQueryParam'
 *       - $ref: '#/parameters/languageQueryParam'
 *       - $ref: '#/parameters/limitQueryParam'
 *       - $ref: '#/parameters/categoryQueryParam'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/MediaList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.get(
  '/category/:category',
  auth,
  catchErrors(MovieController.getByCategory)
);

/**
 * @swagger
 * /similar:
 *   get:
 *     summary: Get similar medias
 *     description: Returns a list of media matching the provided ID and type
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *       - $ref: '#/parameters/mediaTypeQueryParam'
 *       - $ref: '#/parameters/languageQueryParam'
 *       - $ref: '#/parameters/limitQueryParam'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/MediaList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.get('/similar', auth, MovieController.getSimilar);

/**
 * @swagger
 * /recommended:
 *   get:
 *     summary: Get recommended medias
 *     description: Returns a list of media matching the provided ID and type
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *       - $ref: '#/parameters/mediaTypeQueryParam'
 *       - $ref: '#/parameters/languageQueryParam'
 *       - $ref: '#/parameters/limitQueryParam'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/MediaList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.get('/recommended', auth, MovieController.getRecommended);

/**
 * @swagger
 * /searchById:
 *   post:
 *     summary: Get media with ID
 *     description: Returns a media matching the provided ID and type
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaId
 *               - mediaType
 *             properties:
 *               mediaId:
 *                 $ref: '#/definitions/mediaId'
 *               mediaType:
 *                 $ref: '#/definitions/mediaType'
 *               language:
 *                 $ref: '#/definitions/language'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/MediaList'
 *               properties:
 *                 cast:
 *                   $ref: '#/definitions/castArray'
 *                 isFavorite:
 *                   $ref: '#/definitions/favorite-isFavorite'
 *                 watched:
 *                   $ref: '#/definitions/watched'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/searchById', auth, catchErrors(MovieController.searchById));

/**
 * @swagger
 * /searchByTitle:
 *   post:
 *     summary: Get medias with title
 *     description: Returns a list of media matching the provided title
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 $ref: '#/definitions/title'
 *               language:
 *                 $ref: '#/definitions/language'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/MediaList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/searchByTitle', auth, catchErrors(MovieController.searchByTitle));

module.exports = router;
