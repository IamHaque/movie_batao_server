const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.getById = async (_id) => {
  const user = await User.findById(_id);
  return user?._doc;
};

module.exports.get = async (query) => {
  const user = await User.findOne(query);
  return user?._doc;
};

module.exports.create = async (data) => {
  const user = await User.create(data);
  return user?._doc;
};

/**
 * FAVORITE
 **/

module.exports.getFavorite = async (_id, mediaId) => {
  const user = await User.findById(_id)
    .select('favorites')
    .populate({
      path: 'favorites',
      match: {
        mediaId,
      },
    })
    .limit(1);
  return user?._doc;
};

module.exports.getAllFavorites = async (_id) => {
  const userPromise = User.findById(_id).select('favorites -_id').populate({
    path: 'favorites',
  });

  const totalPromise = User.aggregate()
    .match({ _id: getId(_id) })
    .project({
      favorites: { $size: '$favorites' },
    });

  const [user, favorites] = await Promise.all([userPromise, totalPromise]);
  const favoriteCount = favorites.length > 0 ? favorites[0]?.favorites : -1;

  return { total: favoriteCount, favorites: user?._doc?.favorites };
};

module.exports.addFavorite = async (_id, favoriteId) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { $push: { favorites: favoriteId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

module.exports.removeFavorite = async (_id, favoriteId) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { $pull: { favorites: favoriteId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

/**
 * COLLECTION
 **/

module.exports.getAllCollections = async (_id) => {
  const user = await User.findById(_id).select('collections -_id').populate({
    path: 'collections',
  });
  return user?._doc?.collections;
};

module.exports.addCollection = async (_id, collectionId) => {
  const user = await User.findByIdAndUpdate(
    _id,
    { $push: { collections: collectionId } },
    {
      new: true,
    }
  ).select('collections -_id');
  return user?._doc?.collections;
};

function getId(_id) {
  return new mongoose.Types.ObjectId(_id);
}

function getQueryFilters(filters) {
  let { skip, limit, sortBy } = filters;

  skip = skip ? Number(skip) : 0;
  limit = limit ? Number(limit) : 10;
  sortBy = sortBy || { createdAt: -1 };

  return { skip, limit, sortBy };
}
