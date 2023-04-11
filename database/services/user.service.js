const UserSchema = require('../models/user.model');

module.exports.getById = async (_id) => {
  const user = await UserSchema.findById(_id);
  return user?._doc;
};

module.exports.get = async (query) => {
  const user = await UserSchema.findOne(query);
  return user?._doc;
};

module.exports.create = async (data) => {
  const user = await UserSchema.create(data);
  return user?._doc;
};

module.exports.removeFavoriteMedia = async (_id, favoriteMediaId) => {
  const user = await UserSchema.findByIdAndUpdate(
    _id,
    { $pull: { favorites: favoriteMediaId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

module.exports.addFavoriteMedia = async (_id, favoriteMediaId) => {
  const user = await UserSchema.findByIdAndUpdate(
    _id,
    { $push: { favorites: favoriteMediaId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

module.exports.getFavorite = async (_id, mediaId) => {
  const user = await UserSchema.findById(_id)
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
  const user = await UserSchema.findById(_id)
    .select('favorites -_id')
    .populate({
      path: 'favorites',
    });
  return user?._doc?.favorites;
};
