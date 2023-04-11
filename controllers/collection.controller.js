const Logger = require('../middlewares/logger.middleware');

const UserService = require('../database/services/user.service');
const CollectionService = require('../database/services/collection.service');

/**
 * Returns user collections
 */
module.exports.getCollections = async (req, res, next) => {
  const collections = await UserService.getAllCollections(req?.user?._id);
  if (!collections) return next(new Error('error fetching collections'));

  res.send(collections);
};

/**
 * Creates and returns a new collection
 *
 * @requires {name} name: collection name
 * @optional {isPublic} isPublic: collection visibility
 */
module.exports.createCollection = async (req, res, next) => {
  const { name, isPublic } = req.body;
  if (!name) return next(new Error('name is required'));

  const { _id } = req?.user;
  const collection = await CollectionService.create({
    name,
    isPublic,
    owner: _id,
  });

  if (!collection) return next(new Error('error creating collection'));
  await UserService.addCollection(_id, collection?._id);

  delete collection?.__v;
  res.send(collection);
};

/**
 * Adds media in collection
 *
 * @requires {id} id: collection id
 * @requires {mediaId} mediaId: id of the inserted media
 * @requires {mediaType} mediaType: type of the inserted media (tv or movie)
 */
module.exports.addMedia = async (req, res, next) => {
  const { id, mediaId, mediaType } = req.body;
  if (!id) return next(new Error('id is required'));
  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  const status = await CollectionService.addMedia(id, {
    mediaId,
    mediaType,
  });
  if (!status) return next(new Error('error adding media to collection'));

  res.send({ success: status?.modifiedCount === 1 });
};

/**
 * Removes media from collection
 *
 * @requires {id} id: collection id
 * @requires {mediaId} mediaId: id of the inserted media
 */
module.exports.removeMedia = async (req, res, next) => {
  const { id, mediaId } = req.body;
  if (!id) return next(new Error('id is required'));
  if (!mediaId) return next(new Error('mediaId is required'));

  const status = await CollectionService.removeMedia(id, mediaId);
  if (!status) return next(new Error('error adding media to collection'));

  res.send({ success: status?.modifiedCount === 1 });
};
