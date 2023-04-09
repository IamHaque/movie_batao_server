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
    posterPath: {
      type: String,
      trim: true,
      required: 'Poster path is required',
    },
    mediaType: { type: String },
    genres: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    releaseDate: { type: String, trim: true },
    originalTitle: { type: String, trim: true },
    originalLanguage: { type: String, trim: true },
    popularity: Number,
    rating: Number,
    votes: Number,
    adult: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Media', mediaSchema);
