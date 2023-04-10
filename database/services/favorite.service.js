const FavoriteSchema = require('../models/favorite.model');

module.exports.create = async (data) => {
  const favorite = await FavoriteSchema.create(data);
  return favorite?._doc;
};

module.exports.find = async (query) => {
  const favorite = await FavoriteSchema.findOne(query);
  return favorite?._doc;
};

module.exports.remove = async (_id) => {
  await FavoriteSchema.deleteOne({ _id });
};
