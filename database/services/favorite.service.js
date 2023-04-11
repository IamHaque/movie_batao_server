const Favorite = require('../models/favorite.model');

module.exports.create = async (data) => {
  const favorite = await Favorite.create(data);
  return favorite?._doc;
};

module.exports.find = async (query) => {
  const favorite = await Favorite.findOne(query);
  return favorite?._doc;
};

module.exports.remove = async (_id) => {
  await Favorite.deleteOne({ _id });
};
