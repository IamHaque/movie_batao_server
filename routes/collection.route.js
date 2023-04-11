const express = require('express');

const router = express.Router();
const CollectionController = require('../controllers/collection.controller');

const { catchErrors } = require('../handlers/error.handler');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /collection/:
 *   get:
 *     summary: Get user collections
 *     description: Returns a list of user collections
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data of the created collection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/CollectionList'
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
router.get('/', auth, catchErrors(CollectionController.getCollections));

/**
 * @swagger
 * /collection/create:
 *   post:
 *     summary: Create new collection
 *     description: Creates and returns a new collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 $ref: '#/definitions/collection-name'
 *               isPublic:
 *                 $ref: '#/definitions/collection-isPublic'
 *     responses:
 *       200:
 *         description: Data of the created collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/CollectionList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post(
  '/create',
  auth,
  catchErrors(CollectionController.createCollection)
);

/**
 * @swagger
 * /collection/addMedia:
 *   post:
 *     summary: Add media into collection
 *     description: Adds media into collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - mediaId
 *               - mediaType
 *             properties:
 *               mediaId:
 *                 $ref: '#/definitions/mediaId'
 *               mediaType:
 *                 $ref: '#/definitions/mediaType'
 *               id:
 *                 $ref: '#/definitions/collection-id'
 *     responses:
 *       200:
 *         description: Data of the created collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/CollectionStatus'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/addMedia', auth, catchErrors(CollectionController.addMedia));

/**
 * @swagger
 * /collection/removeMedia:
 *   post:
 *     summary: Remove media from collection
 *     description: Removes media from collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - mediaId
 *             properties:
 *               mediaId:
 *                 $ref: '#/definitions/mediaId'
 *               id:
 *                 $ref: '#/definitions/collection-id'
 *     responses:
 *       200:
 *         description: Data of the created collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/CollectionStatus'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post(
  '/removeMedia',
  auth,
  catchErrors(CollectionController.removeMedia)
);

module.exports = router;
