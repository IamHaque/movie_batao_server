const Collection = require('../models/collection.model');

module.exports.create = async (data) => {
  const collection = await Collection.create(data);
  return collection?._doc;
};

module.exports.find = async (query) => {
  const collection = await Collection.findOne(query);
  return collection?._doc;
};

module.exports.remove = async (query) => {
  const { deletedCount } = await Collection.deleteOne(query);
  return deletedCount === 1;
};

module.exports.checkAndFind = async (_id, memberId) => {
  const collection = await Collection.findById(_id)
    .where({
      $or: [
        { isPublic: true },
        { owner: memberId },
        { members: { $in: [memberId] } },
      ],
    })
    .populate({
      path: 'members',
      select: 'email username',
    });

  return collection?._doc;
};

module.exports.checkAndAddMedia = async (_id, memberId, media) => {
  const collection = await Collection.updateOne(
    {
      _id,
      'medias.mediaId': { $ne: media.mediaId },
      $or: [
        { isPublic: true },
        { owner: memberId },
        { members: { $in: [memberId] } },
      ],
    },
    { $push: { medias: media } },
    {
      new: true,
    }
  );
  return collection;
};

module.exports.checkAndRemoveMedia = async (_id, memberId, mediaId) => {
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

module.exports.checkAndUpdate = async (_id, userId, data) => {
  const { modifiedCount } = await Collection.updateOne(
    {
      _id,
      owner: userId,
    },
    data,
    {
      new: true,
    }
  );
  return modifiedCount === 1;
};

module.exports.addMember = async (_id, memberId) => {
  const collection = await Collection.findByIdAndUpdate(
    _id,
    { $push: { members: memberId } },
    {
      new: true,
    }
  ).populate({
    path: 'members',
    select: 'email username',
  });
  return collection?._doc;
};

module.exports.removeMember = async (_id, memberId) => {
  const collection = await Collection.findByIdAndUpdate(
    _id,
    { $pull: { members: memberId } },
    {
      new: true,
    }
  );
  return collection?._doc;
};
