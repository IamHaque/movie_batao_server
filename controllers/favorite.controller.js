const axios = require('axios');
const Logger = require('../middlewares/logger.middleware');

const UserService = require('../database/services/user.service');
const FavoriteService = require('../database/services/favorite.service');

const MovieHandler = require('../handlers/media.handler');
const CacheHandler = require('../handlers/cache.handler');

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
    await UserService.addFavorite(_id, createdMedia?._id);
    return res.send({ mediaId, mediaType, isFavorite: true });
  }

  await FavoriteService.remove(media?._id);
  await UserService.removeFavorite(_id, media?._id);
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
