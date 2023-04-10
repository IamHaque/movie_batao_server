const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionMediaSchema = mongoose.Schema({
  mediaId: {
    type: Number,
    unique: true,
  },
  mediaType: String,
  watchedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const collectionSchema = new Schema(
  {
    medias: [{ type: CollectionMediaSchema }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Collection', collectionSchema);
