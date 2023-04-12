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
 * /collection/getById:
 *   post:
 *     summary: Get collection
 *     description: Returns collection by ID
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
 *               - collectionId
 *             properties:
 *               collectionId:
 *                 $ref: '#/definitions/collection-id'
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
router.post('/getById', auth, catchErrors(CollectionController.getCollection));

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
router.post(
  '/create',
  auth,
  catchErrors(CollectionController.createCollection)
);

/**
 * @swagger
 * /collection/remove:
 *   post:
 *     summary: Remove collection
 *     description: Removes a created collection
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
 *               - collectionId
 *             properties:
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
  '/remove',
  auth,
  catchErrors(CollectionController.removeCollection)
);

/**
 * @swagger
 * /collection/isEmpty:
 *   post:
 *     summary: Check if empty collection
 *     description: Checks if collection is empty or not
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
 *               - collectionId
 *             properties:
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
  '/isEmpty',
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
 * /collection/join:
 *   post:
 *     summary: Join a collection
 *     description: Adds user to an existing collection
 *     tags: [Collection]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/CollectionList'
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
router.post('/join', auth, catchErrors(CollectionController.joinCollection));
/**
 * @swagger
 * /collection/leave:
 *   post:
 *     summary: Leave a collection
 *     description: Removes user from a joined collection
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
 *               - collectionId
 *             properties:
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
router.post('/leave', auth, catchErrors(CollectionController.leaveCollection));

module.exports = router;
