const axios = require('axios');
const Logger = require('../middlewares/logger.middleware');

const MovieHandler = require('../handlers/media.handler');

const FavoriteService = require('../database/services/favorite.service');

const CATEGORIES = {
  nowPlaying: 'now_playing',
  topRated: 'top_rated',
  trending: 'popular',
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

  const { _id } = req?.user;
  const media = await FavoriteService.find({ mediaId, user: _id });
  const isFavorite = !!media;
  const watched = media?.watched || false;

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
  res.json({ ...mediaResult, cast: castResult, isFavorite, watched });
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
 * Returns a list of medias of provided category
 *
 * @required {category} category: category of the medias
 * @required {mediaType} mediaType: type of the searched media (tv or movie)
 * @optional {language} language: language of the response object
 * @optional {limit} limit: limit the response object
 */
module.exports.getByCategory = async (req, res, next) => {
  const { category } = req.params;
  const { language, limit } = req.query;
  const mediaType = req.query.mediaType || 'movie';

  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  if (!CATEGORIES[category]) return next(new Error('invalid category'));

  const response = await axios({
    method: 'get',
    url: MovieHandler.getByCategoryEndpoint(
      CATEGORIES[category],
      mediaType,
      language
    ),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformMediaResponse({
    mediaType,
    response,
    limit,
  });

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

  res.json(results);
};
