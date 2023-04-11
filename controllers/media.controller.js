const axios = require('axios');

const Logger = require('../middlewares/logger.middleware');
const MovieHandler = require('../handlers/media.handler');
const CacheHandler = require('../handlers/cache.handler');
const UserService = require('../database/services/user.service');
const FavoriteService = require('../database/services/favorite.service');

module.exports.greet = (req, res) => {
  res.json({
    message: 'Welcome to MovieBatao',
  });
};

/**
 * Returns media object against passed ID
 *
 * @requires {mediaId} mediaId: id of the searched media
 * @requires {mediaType} mediaType: type of the searched media (tv or movie)
 * @optional {language} language: language of the response object
 */
module.exports.searchById = async (req, res, next) => {
  const language = req.body.language;

  const { mediaId, mediaType } = req.body;
  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  let mediaKey = 'media_' + mediaType;
  if (mediaId) mediaKey += '_' + mediaId;

  let cachedResults = await CacheHandler.getCache(mediaKey);
  if (cachedResults) return res.json(cachedResults);

  const response = await axios({
    method: 'get',
    url: MovieHandler.searchByIdEndpoint(mediaId, mediaType, language),
  });

  if (!response.data) return next(new Error('error fetching data'));

  const result = MovieHandler.mapMediaObject(response.data, mediaType);
  await CacheHandler.setCache(mediaKey, result);
  res.json(result);
};

/**
 * Returns a list of media objects containing searched title
 *
 * @requires {title} title: title of the searched media
 * @optional {language} language: language of the response object
 */
module.exports.searchByTitle = async (req, res, next) => {
  const language = req.body.language;

  const title = req.body.title;
  if (!title) return next(new Error('title is required'));

  const response = await axios({
    method: 'get',
    url: MovieHandler.searchByTitleEndpoint(title, language),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformResponse({ response });
  res.json(results);
};

/**
 * Returns a list of popular media
 *
 * @optional {mediaType} mediaType: type of the searched media (tv or movie)
 * @optional {language} language: language of the response object
 * @optional {limit} limit: limit the response object
 */
module.exports.getPopular = async (req, res, next) => {
  const { language, limit } = req.query;
  const mediaType = req.query.mediaType || 'movie';

  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  let popularMediaKey = 'popular_' + mediaType;
  if (language) popularMediaKey += '_' + language;
  if (limit) popularMediaKey += '_' + limit;

  let cachedResults = await CacheHandler.getCache(popularMediaKey);
  if (cachedResults) return res.json(cachedResults);

  const response = await axios({
    method: 'get',
    url: MovieHandler.getPopularEndpoint(mediaType, language),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformResponse({
    mediaType,
    response,
    limit,
  });

  await CacheHandler.setCache(popularMediaKey, results);
  res.json(results);
};

/**
 * Returns a list of similar media for the source media
 *
 * @requires {mediaId} mediaId: id of the source media
 * @requires {mediaType} mediaType: type of the source media (tv or movie)
 * @optional {language} language: language of the response object
 * @optional {limit} limit: limit the response object
 */
module.exports.getSimilar = async (req, res, next) => {
  const { mediaId, language, limit } = req.query;
  const mediaType = req.query.mediaType || 'movie';

  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  let similarMediaKey = 'similar_' + mediaType + '_' + mediaId;
  if (language) similarMediaKey += '_' + language;
  if (limit) similarMediaKey += '_' + limit;

  let cachedResults = await CacheHandler.getCache(similarMediaKey);
  if (cachedResults) return res.json(cachedResults);

  const response = await axios({
    method: 'get',
    url: MovieHandler.getSimilarEndpoint(mediaId, mediaType, language),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformResponse({
    mediaType,
    response,
    limit,
  });

  await CacheHandler.setCache(similarMediaKey, results);
  res.json(results);
};

/**
 * Returns a list of recommended media for the source media
 *
 * @requires {mediaId} mediaId: id of the source media
 * @requires {mediaType} mediaType: type of the source media (tv or movie)
 * @optional {language} language: language of the response object
 * @optional {limit} limit: limit the response object
 */
module.exports.getRecommended = async (req, res, next) => {
  const { mediaId, language, limit } = req.query;
  const mediaType = req.query.mediaType || 'movie';

  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  let recommendedMediaKey = 'recommended_' + mediaType + '_' + mediaId;
  if (language) recommendedMediaKey += '_' + language;
  if (limit) recommendedMediaKey += '_' + limit;

  let cachedResults = await CacheHandler.getCache(recommendedMediaKey);
  if (cachedResults) return res.json(cachedResults);

  const response = await axios({
    method: 'get',
    url: MovieHandler.getRecommendedEndpoint(mediaId, mediaType, language),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformResponse({
    mediaType,
    response,
    limit,
  });

  await CacheHandler.setCache(recommendedMediaKey, results);
  res.json(results);
};

/**
 * Returns favorite media for user
 */
module.exports.getFavorites = async (req, res, next) => {
  const favorites = await UserService.getAllFavorites(req?.user?._id);
  if (!favorites) return next(new Error('error fetching favorite medias'));

  const favoriteMedias = [];

  for (let favorite of favorites) {
    try {
      const { _id, mediaId, mediaType, watched, updatedAt } = favorite;
      let media = {
        id: _id,
        watched: watched,
        updatedAt: updatedAt,
      };

      let mediaKey = 'media_' + mediaType + '_' + mediaId;

      let cachedResults = await CacheHandler.getCache(mediaKey);
      if (cachedResults) {
        favoriteMedias.push({ ...cachedResults, ...media });
        continue;
      }

      const response = await axios({
        method: 'get',
        url: MovieHandler.searchByIdEndpoint(mediaId, mediaType),
      });

      const result = MovieHandler.mapMediaObject(response.data, mediaType);
      await CacheHandler.setCache(mediaKey, result);
      favoriteMedias.push({ ...result, ...media });
    } catch (e) {
      console.log('GET Error:', e.message);
    }
  }

  res.send(favoriteMedias);
};

/**
 * Toggles favorite flag of the passed media
 *
 * @requires {mediaId} mediaId: id of the passed media
 * @requires {mediaType} mediaType: type of the passed media (tv or movie)
 */
module.exports.toggleFavorite = async (req, res, next) => {
  const { mediaId, mediaType } = req.query;
  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  const { _id } = req?.user;
  const media = await FavoriteService.find({ mediaId, user: _id });

  if (!media) {
    const createdMedia = await FavoriteService.create({
      mediaId,
      mediaType,
      user: _id,
    });
    await UserService.addFavoriteMedia(_id, createdMedia?._id);
    return res.send({ mediaId, mediaType, isFavorite: true });
  }

  await FavoriteService.remove(media?._id);
  await UserService.removeFavoriteMedia(_id, media?._id);
  res.send({ mediaId, mediaType, isFavorite: false });
};

/**
 * Returns whether media is favorite or not
 *
 * @requires {mediaId} mediaId: id of the passed media
 */
module.exports.isFavorite = async (req, res, next) => {
  const { mediaId } = req.query;
  if (!mediaId) return next(new Error('mediaId is required'));

  const { _id } = req?.user;
  const media = await FavoriteService.find({ mediaId, user: _id });

  const isFavorite = !!media;
  res.send({ mediaId, isFavorite });
};
