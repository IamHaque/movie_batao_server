const express = require('express');

const router = express.Router();
const CollectionController = require('../controllers/collection.controller');

const { catchErrors } = require('../handlers/error.handler');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /collection:
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
 *                 $ref: '#/definitions/CollectionsList'
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
 * /collection/{collectionId}:
 *   get:
 *     summary: Get collection
 *     description: Returns collection by ID
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     responses:
 *       200:
 *         description: Data of the created collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/CollectionList'
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
router.get(
  '/:collectionId',
  auth,
  catchErrors(CollectionController.getCollection)
);

/**
 * @swagger
 * /collection:
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
 *               $ref: '#/definitions/CollectionsList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ServerError'
 *
 */
router.post('/', auth, catchErrors(CollectionController.createCollection));

/**
 * @swagger
 * /collection/{collectionId}:
 *   patch:
 *     summary: Update collection
 *     description: Updates collection name/visibility
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 $ref: '#/definitions/collection-name'
 *               isPublic:
 *                 $ref: '#/definitions/collection-isPublic'
 *     responses:
 *       200:
 *         description: Status of the operation
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
router.patch(
  '/:collectionId',
  auth,
  catchErrors(CollectionController.updateCollection)
);

/**
 * @swagger
 * /collection/{collectionId}:
 *   delete:
 *     summary: Remove collection
 *     description: Removes a created collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     responses:
 *       200:
 *         description: Status of the operation
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
router.delete(
  '/:collectionId',
  auth,
  catchErrors(CollectionController.removeCollection)
);

/**
 * @swagger
 * /collection/isEmpty/{collectionId}:
 *   get:
 *     summary: Check if empty collection
 *     description: Checks if collection is empty or not
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     responses:
 *       200:
 *         description: Status of the operation
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
router.get(
  '/isEmpty/:collectionId',
  auth,
  catchErrors(CollectionController.isEmptyCollection)
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
 *               - mediaId
 *               - mediaType
 *               - collectionId
 *             properties:
 *               mediaId:
 *                 $ref: '#/definitions/mediaId'
 *               mediaType:
 *                 $ref: '#/definitions/mediaType'
 *               collectionId:
 *                 $ref: '#/definitions/collection-id'
 *     responses:
 *       200:
 *         description: Status of the operation
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
 *               - mediaId
 *               - collectionId
 *             properties:
 *               mediaId:
 *                 $ref: '#/definitions/mediaId'
 *               collectionId:
 *                 $ref: '#/definitions/collection-id'
 *     responses:
 *       200:
 *         description: Status of the operation
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

/**
 * @swagger
 * /collection/join/{collectionId}:
 *   post:
 *     summary: Join a collection
 *     description: Adds user to an existing collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     responses:
 *       200:
 *         description: Status of the operation
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
  '/join/:collectionId',
  auth,
  catchErrors(CollectionController.joinCollection)
);

/**
 * @swagger
 * /collection/leave/{collectionId}:
 *   post:
 *     summary: Leave a collection
 *     description: Removes user from a joined collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/collectionIdQueryParam'
 *     responses:
 *       200:
 *         description: Status of the operation
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
  '/leave/:collectionId',
  auth,
  catchErrors(CollectionController.leaveCollection)
);

module.exports = router;
