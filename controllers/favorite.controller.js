const axios = require('axios');
const Logger = require('../middlewares/logger.middleware');

const UserService = require('../database/services/user.service');
const FavoriteService = require('../database/services/favorite.service');

const MovieHandler = require('../handlers/media.handler');

/**
 * Returns favorite media for user
 */
module.exports.getFavorites = async (req, res, next) => {
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 0;

  let { total, favorites } = await UserService.getAllFavorites(req?.user?._id);
  if (!favorites) return next(new Error('error fetching favorite medias'));

  favorites = favorites.sort((a, b) => b.createdAt - a.createdAt);
  if (limit > 0) favorites = favorites.slice(skip, skip + limit);

  const favoriteMedias = [];
  const mediaDataPromises = [];

  for (let favorite of favorites) {
    mediaDataPromises.push(
      axios({
        method: 'get',
        url: MovieHandler.searchByIdEndpoint(
          favorite.mediaId,
          favorite.mediaType
        ),
      })
    );
  }

  const allResponses = await Promise.all(mediaDataPromises);
  for (let response of allResponses) {
    try {
      const mediaId = response.data.id;
      const mediaType = response?.request?.path?.includes('tv')
        ? 'tv'
        : 'movie';
      const result = MovieHandler.mapMediaObject(response.data, mediaType);

      const { _id, watched, updatedAt } = favorites.find(
        (el) => el.mediaId === mediaId
      );

      favoriteMedias.push({
        _id,
        watched,
        updatedAt,
        ...result,
      });
    } catch (e) {}
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
