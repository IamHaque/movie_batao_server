const Collection = require('../models/collection.model');

module.exports.create = async (data) => {
  const collection = await Collection.create(data);
  return collection?._doc;
};

module.exports.find = async (query) => {
  const collection = await Collection.findOne(query);
  return collection?._doc;
};

module.exports.remove = async (_id) => {
  await collection.deleteOne({ _id });
};

module.exports.addMedia = async (_id, media) => {
  const collection = await Collection.updateOne(
    { _id, 'medias.mediaId': { $ne: media.mediaId } },
    { $push: { medias: media } },
    {
      new: true,
    }
  );
  return collection;
};

module.exports.removeMedia = async (_id, mediaId) => {
  const collection = await Collection.updateOne(
    { _id, 'medias.mediaId': { $eq: mediaId } },
    {
      $pull: {
        medias: {
          mediaId,
        },
      },
    },
    {
      new: true,
    }
  );
  return collection;
};
