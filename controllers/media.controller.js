const axios = require('axios');
const Logger = require('../middlewares/logger.middleware');

const MovieHandler = require('../handlers/media.handler');
const CacheHandler = require('../handlers/cache.handler');

const FavoriteService = require('../database/services/favorite.service');

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

  const { _id } = req?.user;
  const media = await FavoriteService.find({ mediaId, user: _id });
  const isFavorite = !!media;

  const mediaRequest = axios({
    method: 'get',
    url: MovieHandler.searchByIdEndpoint(mediaId, mediaType, language),
  });

  const castRequest = axios({
    method: 'get',
    url: MovieHandler.getCastEndpoint(mediaId, mediaType, language),
  });

  const [mediaResponse, castResponse] = await Promise.all([
    mediaRequest,
    castRequest,
  ]);

  if (!mediaResponse.data || !castResponse.data)
    return next(new Error('error fetching data'));

  const mediaResult = MovieHandler.mapMediaObject(
    mediaResponse.data,
    mediaType
  );

  const castResult = MovieHandler.transformCastResponse({
    response: castResponse,
  });
  res.json({ ...mediaResult, cast: castResult, isFavorite });
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

  const results = MovieHandler.transformMediaResponse({ response });
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

  const results = MovieHandler.transformMediaResponse({
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

  const results = MovieHandler.transformMediaResponse({
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

  const results = MovieHandler.transformMediaResponse({
    mediaType,
    response,
    limit,
  });

  await CacheHandler.setCache(recommendedMediaKey, results);
  res.json(results);
};
