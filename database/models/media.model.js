const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    title: { type: String, trim: true, required: 'Title is required' },
    mediaId: {
      type: Number,
      unique: true,
      required: 'Media ID is required',
    },
    poster_path: {
      type: String,
      trim: true,
      required: 'Poster path is required',
    },
    media_type: { type: String },
    overview: { type: String, trim: true },
    genres: [{ type: String, trim: true }],
    release_date: { type: String, trim: true },
    original_title: { type: String, trim: true },
    original_language: { type: String, trim: true },
    popularity: Number,
    adult: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Media', mediaSchema);
