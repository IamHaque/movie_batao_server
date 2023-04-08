const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = mongoose.Schema({
  mediaId: {
    type: Number,
    unique: true,
  },
  media_type: String,
  watchedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const collectionSchema = new Schema(
  {
    medias: [{ type: MediaSchema }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Collection', collectionSchema);
