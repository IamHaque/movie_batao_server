const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = mongoose.Schema({
  mediaId: {
    type: Number,
    unique: true,
  },
  media_type: String,
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: 'Email ID is required',
    },
    username: {
      trim: true,
      type: String,
      required: 'Username is required',
    },
    provider: {
      trim: true,
      type: String,
      default: 'local',
    },
    favorites: [{ type: MediaSchema }],
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
