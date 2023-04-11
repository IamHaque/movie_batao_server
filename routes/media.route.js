const express = require('express');

const router = express.Router();
const MovieController = require('../controllers/media.controller');

const { catchErrors } = require('../handlers/error.handler');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Wrapper for TMDB API
 */

/**
 * @swagger
 * tags:
 *   name: FavoriteMedia
 *   description: Handles favorite media endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * definitions:
 *   mediaId:
 *     type: string
 *     example: 603692
 *     description: media ID
 *   mediaType:
 *     type: string
 *     example: movie
 *     description: media type
 *   language:
 *     type: string
 *     example: en-US
 *     description: language in ISO 639-1 code
 *   limit:
 *     type: number
 *     example: 10
 *     description: limit of response items
 *   title:
 *     type: number
 *     example: John Wick
 *     description: media title
 *   email:
 *     type: string
 *     example: example@email.com
 *     description: user email
 *   token:
 *     type: string
 *     example: eyJhbGciOiJIUzI1
 *     description: JWT token
 *
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
 *   FavoriteList:
 *     properties:
 *       id:
 *         type: string
 *         example: 669223
 *       watched:
 *         type: boolean
 *         example: false
 *       updatedAt:
 *         type: string
 *         example: 2023-04-09T11:35:06.299Z
 *
 *   FavoriteStatus:
 *     properties:
 *       mediaId:
 *         type: number
 *         example: 669223
 *       mediaType:
 *         type: string
 *         example: movie
 *       isFavorite:
 *         type: boolean
 *         example: false
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
 *   mediaIdQueryParam:
 *     in: query
 *     name: mediaId
 *     schema:
 *       $ref: '#/definitions/mediaId'
 *     required: true
 *   mediaTypeQueryParam:
 *     in: query
 *     name: mediaType
 *     schema:
 *       $ref: '#/definitions/mediaType'
 *     required: true
 *   languageQueryParam:
 *     in: query
 *     name: language
 *     schema:
 *       $ref: '#/definitions/language'
 *   limitQueryParam:
 *     in: query
 *     name: limit
 *     schema:
 *       $ref: '#/definitions/limit'
 */

router.get('/', MovieController.greet);

/**
 * @swagger
 * /popular:
 *   get:
 *     summary: Retrieve popular medias
 *     description: Returns a list of media matching the provided ID
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
router.get('/popular', auth, MovieController.getPopular);

/**
 * @swagger
 * /similar:
 *   get:
 *     summary: Retrieve similar medias
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
 *     summary: Retrieve recommended medias
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
 *     summary: Retrieve media with ID
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
 *     summary: Retrieve medias with title
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

/**
 * @swagger
 * /favorite:
 *   get:
 *     summary: Retrieve favorite medias
 *     description: Returns a list of user's favorite medias
 *     tags: [FavoriteMedia]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/FavoriteList'
 *                   - $ref: '#/definitions/MediaList'
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.get('/favorite', auth, catchErrors(MovieController.getFavorites));

/**
 * @swagger
 * /favorite/check:
 *   get:
 *     summary: Retrieve favorite status
 *     description: Returns whether the media is in user favorites or not
 *     tags: [FavoriteMedia]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/FavoriteStatus'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.get('/favorite/check', auth, catchErrors(MovieController.isFavorite));

/**
 * @swagger
 * /favorite/toggle:
 *   get:
 *     summary: Toggles favorite status
 *     description: Returns favorite media status after toggle
 *     tags: [FavoriteMedia]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *       - $ref: '#/parameters/mediaTypeQueryParam'
 *     responses:
 *       200:
 *         description: Object containing user data fetched from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/FavoriteStatus'
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
  '/favorite/toggle',
  auth,
  catchErrors(MovieController.toggleFavorite)
);

module.exports = router;
