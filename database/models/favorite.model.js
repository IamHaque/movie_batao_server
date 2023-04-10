const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    mediaId: {
      type: Number,
      unique: true,
    },
    media_type: String,
    watched: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Favorite', favoriteSchema);
