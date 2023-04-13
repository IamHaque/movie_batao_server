const express = require('express');

const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');

const { catchErrors } = require('../handlers/error.handler');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /favorite/:
 *   get:
 *     summary: Get user favorites
 *     description: Returns a list of user's favorite medias
 *     tags: [Favorite]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite medias of the user
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
router.get('/', auth, catchErrors(FavoriteController.getFavorites));

/**
 * @swagger
 * /favorite/check:
 *   get:
 *     summary: Check if user favorite
 *     description: Returns whether the media is in user favorites or not
 *     tags: [Favorite]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *     responses:
 *       200:
 *         description: Status of favorite media for user
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
router.get('/check', auth, catchErrors(FavoriteController.isFavorite));

/**
 * @swagger
 * /favorite/toggle:
 *   get:
 *     summary: Toggle user favorite
 *     description: Returns favorite media status after toggle
 *     tags: [Favorite]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *       - $ref: '#/parameters/mediaTypeQueryParam'
 *     responses:
 *       200:
 *         description: Status of favorite media for user
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
router.get('/toggle', auth, catchErrors(FavoriteController.toggleFavorite));

/**
 * @swagger
 * /favorite/toggleWatched:
 *   get:
 *     summary: Toggle watched status
 *     description: Toggles and returns watched status
 *     tags: [Favorite]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/mediaIdQueryParam'
 *     responses:
 *       200:
 *         description: Watched status of the media for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/WatchedStatus'
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
  '/toggleWatched',
  auth,
  catchErrors(FavoriteController.toggleWatched)
);

module.exports = router;
