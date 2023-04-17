const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionMediaSchema = mongoose.Schema(
  {
    mediaId: Number,
    mediaType: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    watchedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const collectionSchema = new Schema(
  {
    name: {
      trim: true,
      type: String,
      required: 'Collection name is required',
    },
    medias: [{ type: CollectionMediaSchema }],
    isPublic: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Collection', collectionSchema);
