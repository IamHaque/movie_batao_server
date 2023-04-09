const axios = require('axios');
const MovieHandler = require('../handlers/media.handler');
const CacheHandler = require('../handlers/cache.handler');

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

  const response = await axios({
    method: 'get',
    url: MovieHandler.searchByIdEndpoint(mediaId, mediaType, language),
  });

  if (!response.data) return next(new Error('error fetching data'));

  const result = MovieHandler.mapMediaObject(response.data, mediaType);
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
