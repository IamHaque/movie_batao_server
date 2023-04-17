const axios = require('axios');
const Logger = require('../middlewares/logger.middleware');

const UserService = require('../database/services/user.service');
const CollectionService = require('../database/services/collection.service');

const MovieHandler = require('../handlers/media.handler');

/**
 * Returns user collections
 */
module.exports.getCollections = async (req, res, next) => {
  let collections = await UserService.getAllCollections(req?.user?._id);
  if (!collections) return next(new Error('error fetching collections'));

  collections = collections.map(getCollectionSummary);
  res.send(collections);
};

/**
 * Returns collection by ID
 *
 * @requires {collectionId} collectionId: collection id
 */
module.exports.getCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { _id: userId } = req?.user;
  const collection = await CollectionService.checkAndFind(collectionId, userId);
  if (!collection) return next(new Error('error fetching collection'));

  const { _id, email, username } = await UserService.getById(collection?.owner);
  const members = [
    {
      _id,
      email,
      username,
    },
    ...collection.members,
  ];

  let collectionMedias = collection?.medias || [];
  collectionMedias = collectionMedias.sort((a, b) => b.createdAt - a.createdAt);

  const mediaDataPromises = [];
  for (let media of collectionMedias) {
    mediaDataPromises.push(
      axios({
        method: 'get',
        url: MovieHandler.searchByIdEndpoint(media.mediaId, media.mediaType),
      })
    );
  }

  let medias = [];
  const allResponses = await Promise.all(mediaDataPromises);
  for (let response of allResponses) {
    try {
      const mediaId = response.data.id;
      const mediaType = response?.request?.path?.includes('tv')
        ? 'tv'
        : 'movie';
      const result = MovieHandler.mapMediaObject(response.data, mediaType);

      const { _id, createdAt, updatedAt, addedBy, watchedBy } =
        collectionMedias.find((el) => el.mediaId === mediaId);

      medias.push({
        _id,
        addedBy,
        createdAt,
        updatedAt,
        watchedBy,
        ...result,
      });
    } catch (e) {}
  }

  delete collection.medias;
  delete collection.members;
  res.send({
    medias,
    members,
    ...collection,
  });
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
  let collection = await CollectionService.create({
    name,
    isPublic,
    owner: _id,
  });

  if (!collection) return next(new Error('error creating collection'));
  await UserService.addCollection(_id, collection?._id);

  collection = getCollectionSummary(collection);
  res.send(collection);
};

/**
 * Checks if collection is empty or not
 *
 * @requires {collectionId} collectionId: collection id
 */
module.exports.isEmptyCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { _id } = req?.user;
  let collection = await CollectionService.find({
    owner: _id,
    _id: collectionId,
  });
  if (!collection) return res.send({ success: false });

  const medias = collection?.medias || [];
  const members = collection?.members || [];
  const isEmpty = medias.length <= 0 && members.length <= 0;

  res.send({ success: isEmpty });
};

/**
 * Updates collection name/visibility
 *
 * @optional {name} name: collection name
 * @optional {isPublic} isPublic: collection visibility
 * @requires {collectionId} collectionId: collection id
 */
module.exports.updateCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { name, isPublic } = req.body;
  if (!name || isPublic === undefined)
    return next(new Error('no data to update'));

  const { _id } = req?.user;
  let collection = await CollectionService.find({
    owner: _id,
    _id: collectionId,
  });

  const isUserCollectionOwner = String(_id) === String(collection?.owner);
  if (!isUserCollectionOwner)
    return next(new Error('user not collection owner'));

  if (name === collection.name && isPublic === collection.isPublic)
    return next(new Error('no data to update'));

  const updateData = {
    name: !name ? collection.name : name,
    isPublic: isPublic === undefined ? collection.isPublic : isPublic,
  };

  let updateStatus = await CollectionService.checkAndUpdate(
    collectionId,
    _id,
    updateData
  );
  if (!updateStatus) return next(new Error('error updating collection'));

  res.send({ success: updateStatus });
};

/**
 * Removes a collection
 *
 * @requires {collectionId} collectionId: collection id
 */
module.exports.removeCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { _id } = req?.user;
  let collection = await CollectionService.find({
    owner: _id,
    _id: collectionId,
  });

  const isUserCollectionOwner = String(_id) === String(collection?.owner);
  if (!isUserCollectionOwner)
    return next(new Error('user not collection owner'));

  let removeStatus = await CollectionService.remove({
    owner: _id,
    _id: collectionId,
  });
  if (!removeStatus) return next(new Error('error deleting collection'));

  await UserService.removeCollectionFromAllMembers(
    [collection?.owner, ...collection?.members],
    collectionId
  );

  res.send({ success: removeStatus });
};

/**
 * Adds media in collection
 *
 * @requires {collectionId} collectionId: collection id
 * @requires {mediaId} mediaId: id of the inserted media
 * @requires {mediaType} mediaType: type of the inserted media (tv or movie)
 */
module.exports.addMedia = async (req, res, next) => {
  const { collectionId, mediaId, mediaType } = req.body;
  if (!collectionId) return next(new Error('collectionId is required'));
  if (!mediaId) return next(new Error('mediaId is required'));
  if (!mediaType) return next(new Error('mediaType is required'));
  if (!['tv', 'movie'].includes(mediaType))
    return next(new Error('invalid mediaType'));

  const { _id } = req?.user;
  const status = await CollectionService.checkAndAddMedia(collectionId, _id, {
    mediaId,
    mediaType,
    addedBy: _id,
  });
  if (!status) return next(new Error('error adding media to collection'));

  res.send({ success: status?.modifiedCount === 1 });
};

/**
 * Removes media from collection
 *
 * @requires {collectionId} collectionId: collection id
 * @requires {mediaId} mediaId: id of the inserted media
 */
module.exports.removeMedia = async (req, res, next) => {
  const { collectionId, mediaId } = req.body;
  if (!collectionId) return next(new Error('collectionId is required'));
  if (!mediaId) return next(new Error('mediaId is required'));

  const { _id } = req?.user;
  const status = await CollectionService.checkAndRemoveMedia(
    collectionId,
    _id,
    mediaId
  );
  if (!status) return next(new Error('error adding media to collection'));

  res.send({ success: status?.modifiedCount === 1 });
};

/**
 * Join a collection
 *
 * @requires {collectionId} collectionId: collection id
 */
module.exports.joinCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { _id: memberId } = req?.user;

  const user = await UserService.getById(memberId);
  if (!user) return next(new Error('invalid user'));

  if (user?.collections?.includes(collectionId))
    return next(new Error('collection already joined'));

  const [userCollections, collection] = await Promise.all([
    UserService.addCollection(memberId, collectionId),
    CollectionService.addMember(collectionId, memberId),
  ]);

  if (!userCollections || !collection)
    return next(new Error('error joining collection'));

  const { _id, email, username } = await UserService.getById(collection?.owner);
  res.send({
    ...collection,
    members: [
      {
        _id,
        email,
        username,
      },
      ...collection.members,
    ],
  });
  res.send(collection);
};

/**
 * Leave a collection
 *
 * @requires {collectionId} collectionId: collection id
 */
module.exports.leaveCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  if (!collectionId) return next(new Error('collectionId is required'));

  const { _id } = req?.user;

  const user = await UserService.getById(_id);
  if (!user) return next(new Error('invalid user'));

  if (!user?.collections?.includes(collectionId))
    return next(new Error('collection not joined'));

  const collection = await CollectionService.find({
    _id: collectionId,
  });
  const isUserCollectionOwner = String(_id) === String(collection?.owner);
  const isCollectionEmpty = collection?.members?.length <= 0;

  if (isUserCollectionOwner && !isCollectionEmpty)
    return res.send({ success: false });

  if (isUserCollectionOwner && isCollectionEmpty) {
    const [userCollections, removeStatus] = await Promise.all([
      UserService.removeCollection(_id, collectionId),
      CollectionService.remove({
        owner: _id,
        _id: collectionId,
      }),
    ]);

    if (!userCollections) return next(new Error('error leaving collection'));
    return res.send({ success: removeStatus });
  }

  const [userCollections, updatedCollection] = await Promise.all([
    UserService.removeCollection(_id, collectionId),
    CollectionService.removeMember(collectionId, _id),
  ]);

  if (!userCollections || !updatedCollection)
    return next(new Error('error leaving collection'));

  res.send({ success: true });
};

// ===== Helpers ===== //

function getCollectionSummary(collection) {
  if (collection._doc) collection = collection?._doc;

  const mediaCount = collection?.medias?.length || 0;
  let memberCount = collection?.members?.length || 0;
  memberCount += 1;

  delete collection.__v;
  delete collection.medias;
  delete collection.members;

  return {
    ...collection,
    mediaCount,
    memberCount,
  };
}
