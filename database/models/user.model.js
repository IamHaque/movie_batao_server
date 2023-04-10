const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    providerId: {
      type: String,
      trim: true,
      unique: true,
      required: 'Provider ID is required',
    },
    provider: {
      trim: true,
      type: String,
      default: 'local',
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
