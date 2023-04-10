const express = require('express');

const router = express.Router();
const MovieController = require('../controllers/media.controller');

const { catchErrors } = require('../handlers/error.handler');

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Wrapper for TMDB API
 */

/**
 * @swagger
 * definitions:
 *   MediaList:
 *     properties:
 *       mediaId:
 *         type: number
 *         example: 669223
 *       adult:
 *         type: boolean
 *         example: false
 *       title:
 *         type: string
 *         example: Title
 *       originalTitle:
 *         type: string
 *         example: Original Title
 *       description:
 *         type: string
 *         example: Est do ad elit cillum velit occaecat
 *       releaseDate:
 *         type: string
 *         example: 2015-04-22
 *       originalLanguage:
 *         type: string
 *         example: en
 *       mediaType:
 *         type: string
 *         example: movie
 *       rating:
 *         type: number
 *         example: 7.2
 *       votes:
 *         type: number
 *         example: 390
 *       popularity:
 *         type: number
 *         example: 210.5
 *       genres:
 *         type: array
 *         items:
 *           type: string
 *         example: ['Action', 'Thriller']
 *       posterPath:
 *         type: string
 *         example: https://posterPath.jpg
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
 * parameters:
 *   mediaIdParam:
 *     in: query
 *     name: mediaId
 *     schema:
 *       type: string
 *       example: 603692
 *     required: true
 *     description: media ID
 *   mediaTypeParam:
 *     in: query
 *     name: mediaType
 *     schema:
 *       type: string
 *       example: movie
 *     required: true
 *     description: media type
 *   languageParam:
 *     in: query
 *     name: language
 *     schema:
 *       type: string
 *       example: en-US
 *     description: language in ISO 639-1 code
 *   limitParam:
 *     in: query
 *     name: limit
 *     schema:
 *       type: number
 *       example: 10
 *     description: limit of response items
 */

router.get('/', MovieController.greet);

/**
 * @swagger
 * /popular:
 *   get:
 *     summary: Retrieve recommended medias
 *     description: Returns a list of media matching the provided title
 *     tags: [Media]
 *     parameters:
 *       - $ref: '#/parameters/mediaTypeParam'
 *       - $ref: '#/parameters/languageParam'
 *       - $ref: '#/parameters/limitParam'
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
router.get('/popular', MovieController.getPopular);

/**
 * @swagger
 * /similar:
 *   get:
 *     summary: Retrieve recommended medias
 *     description: Returns a list of media matching the provided title
 *     tags: [Media]
 *     parameters:
 *       - $ref: '#/parameters/mediaIdParam'
 *       - $ref: '#/parameters/mediaTypeParam'
 *       - $ref: '#/parameters/languageParam'
 *       - $ref: '#/parameters/limitParam'
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
router.get('/similar', MovieController.getSimilar);

/**
 * @swagger
 * /recommended:
 *   get:
 *     summary: Retrieve recommended medias
 *     description: Returns a list of media matching the provided title
 *     tags: [Media]
 *     parameters:
 *       - $ref: '#/parameters/mediaIdParam'
 *       - $ref: '#/parameters/mediaTypeParam'
 *       - $ref: '#/parameters/languageParam'
 *       - $ref: '#/parameters/limitParam'
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
router.get('/recommended', MovieController.getRecommended);

/**
 * @swagger
 * /searchById:
 *   post:
 *     summary: Retrieve media with ID
 *     description: Returns a media matching the provided ID and type
 *     tags: [Media]
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
 *                 type: string
 *                 description: media ID
 *                 example: 603692
 *               mediaType:
 *                 type: string
 *                 description: media type
 *                 example: movie
 *               language:
 *                 type: string
 *                 description: language in ISO 639-1 code
 *                 example: en-US
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/MediaList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/searchById', catchErrors(MovieController.searchById));

/**
 * @swagger
 * /searchByTitle:
 *   post:
 *     summary: Retrieve medias with title
 *     description: Returns a list of media matching the provided title
 *     tags: [Media]
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
 *                 type: string
 *                 description: media title
 *                 example: John Wick
 *               language:
 *                 type: string
 *                 description: language in ISO 639-1 code
 *                 example: en-US
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
router.post('/searchByTitle', catchErrors(MovieController.searchByTitle));

module.exports = router;
