const UserSchema = require('../models/user.model');

module.exports.read = async (id) => {
  const user = await UserSchema.findById(id);
  return user?._doc;
};

module.exports.readByEmail = async (email) => {
  const user = await UserSchema.findOne({ email });
  return user?._doc;
};

module.exports.create = async (data) => {
  const user = await UserSchema.create(data);
  return user?._doc;
};

module.exports.removeFavoriteMedia = async (email, favoriteMediaId) => {
  const user = await UserSchema.findOneAndUpdate(
    { email },
    { $pull: { favorites: favoriteMediaId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

module.exports.addFavoriteMedia = async (email, favoriteMediaId) => {
  const user = await UserSchema.findOneAndUpdate(
    { email },
    { $push: { favorites: favoriteMediaId } },
    {
      new: true,
    }
  ).select('favorites -_id');
  return user?._doc?.favorites;
};

module.exports.getFavorite = async (email, mediaId) => {
  const user = await UserSchema.findOne({ email })
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

module.exports.getAllFavorites = async (email) => {
  const user = await UserSchema.findOne({ email })
    .select('favorites -_id')
    .populate({
      path: 'favorites',
    });
  return user?._doc?.favorites;
};
