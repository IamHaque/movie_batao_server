const express = require('express');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management API
 *   - name: Media
 *     description: Wrapper for TMDB API
 *   - name: Favorite
 *     description: Favorite management API
 *   - name: Collection
 *     description: Collection management API
 *
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

/**
 * @swagger
 * definitions:
 *   db-id:
 *     type: string
 *     example: 6432a2ea9f31dd86c09a6cac
 *     description: DB uuid
 *   db-timestamp:
 *     type: string
 *     example: 2023-04-09T11:35:06.299Z
 *     description: DB timestamp
 *
 *   mediaId:
 *     type: string
 *     example: 603692
 *     description: media ID
 *   mediaType:
 *     type: string
 *     example: movie
 *     description: media type
 *   watched:
 *     type: boolean
 *     example: false
 *     description: media watched
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
 *   collection-id:
 *     $ref: '#/definitions/db-id'
 *   collection-name:
 *     type: string
 *     example: My First Collection
 *     description: collection name
 *   collection-isPublic:
 *     type: boolean
 *     example: false
 *     description: collection visibility
 *
 *   favorite-isFavorite:
 *     type: boolean
 *     example: false
 *     description: media is user favorite or not
 *
 *   castArray:
 *     type: array
 *     items:
 *       type: object
 *       $ref: '#/definitions/CastList'
 *
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
 *   CastList:
 *     properties:
 *       actorName:
 *         type: string
 *         example: John Doe
 *         description: actor name
 *       characterName:
 *         type: string
 *         example: John Doe
 *         description: character name
 *       posterPath:
 *         type: string
 *         description: actor image
 *         example: https://posterPath.jpg
 *
 *   User:
 *     properties:
 *       _id:
 *         $ref: '#/definitions/db-id'
 *       email:
 *         $ref: '#/definitions/email'
 *       username:
 *         $ref: '#/definitions/username'
 *       providerId:
 *         $ref: '#/definitions/providerId'
 *       provider:
 *         $ref: '#/definitions/provider'
 *       createdAt:
 *         $ref: '#/definitions/db-timestamp'
 *       updatedAt:
 *         $ref: '#/definitions/db-timestamp'
 *       token:
 *         type: string
 *         example: eyJhbGciOiJIUzI1
 *
 *   FavoriteList:
 *     properties:
 *       id:
 *         $ref: '#/definitions/db-id'
 *       watched:
 *         $ref: '#/definitions/watched'
 *       updatedAt:
 *         $ref: '#/definitions/db-timestamp'
 *
 *   CollectionList:
 *     properties:
 *       _id:
 *         $ref: '#/definitions/db-id'
 *       owner:
 *         $ref: '#/definitions/db-id'
 *       name:
 *         $ref: '#/definitions/collection-name'
 *       isPublic:
 *         $ref: '#/definitions/collection-isPublic'
 *       createdAt:
 *         $ref: '#/definitions/db-timestamp'
 *       updatedAt:
 *         $ref: '#/definitions/db-timestamp'
 *       medias:
 *         type: array
 *         items:
 *           $ref: '#/definitions/CollectionListMedia'
 *       members:
 *         type: array
 *         items:
 *           $ref: '#/definitions/db-id'
 *
 *   CollectionListMedia:
 *     properties:
 *       _id:
 *         $ref: '#/definitions/db-id'
 *       mediaId:
 *         $ref: '#/definitions/mediaId'
 *       mediaType:
 *         $ref: '#/definitions/mediaType'
 *       watchedBy:
 *         type: array
 *         items:
 *           $ref: '#/definitions/db-id'
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
 *         $ref: '#/definitions/favorite-isFavorite'
 *
 *   CollectionStatus:
 *     properties:
 *       success:
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
 *
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
 *
 */

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MovieBatao',
  });
});

module.exports = router;
