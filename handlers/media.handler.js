const { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMG_URL } = process.env;

const GENRES = {
  10402: { name: 'Music' },
  10749: { name: 'Romance' },
  10751: { name: 'Family' },
  10751: { name: 'Family' },
  10752: { name: 'War' },
  10759: { name: 'Action & Adventure' },
  10762: { name: 'Kids' },
  10763: { name: 'News' },
  10764: { name: 'Reality' },
  10765: { name: 'Sci-Fi & Fantasy' },
  10766: { name: 'Soap' },
  10767: { name: 'Talk' },
  10768: { name: 'War & Politics' },
  10770: { name: 'TV Movie' },
  12: { name: 'Adventure' },
  14: { name: 'Fantasy' },
  16: { name: 'Animation' },
  16: { name: 'Animation' },
  18: { name: 'Drama' },
  18: { name: 'Drama' },
  27: { name: 'Horror' },
  28: { name: 'Action' },
  35: { name: 'Comedy' },
  35: { name: 'Comedy' },
  36: { name: 'History' },
  37: { name: 'Western' },
  37: { name: 'Western' },
  53: { name: 'Thriller' },
  80: { name: 'Crime' },
  80: { name: 'Crime' },
  878: { name: 'Science Fiction' },
  9648: { name: 'Mystery' },
  9648: { name: 'Mystery' },
  99: { name: 'Documentary' },
  99: { name: 'Documentary' },
};

const transformResponse = ({ response, mediaType, limit = 10 }) => {
  return response.data.results
    .map((media) => mapMediaObject(media, mediaType))
    .filter(
      ({ title, originalTitle, posterPath, mediaType }) =>
        ['tv', 'movie'].includes(mediaType) &&
        !!title &&
        !!posterPath &&
        !!originalTitle
    )
    .slice(0, limit)
    .sort((a, b) => b.popularity - a.popularity);
};

const mapMediaObject = (movie, mediaType) => {
  const genres = new Set();
  if (movie.genres) {
    movie.genres.forEach((genre) => {
      genres.add(genre.name);
    });
  }
  if (movie.genre_ids) {
    movie.genre_ids.forEach((genreId) => {
      genres.add(GENRES[genreId]?.name || 'Other');
    });
  }

  const posterPath = !movie.poster_path
    ? null
    : TMDB_IMG_URL + '/w500' + movie.poster_path;

  return {
    posterPath,
    mediaId: movie.id,
    adult: movie.adult,
    votes: movie.vote_count,
    genres: Array.from(genres),
    rating: movie.vote_average,
    description: movie.overview,
    popularity: movie.popularity,
    title: movie.title || movie.name,
    mediaType: movie.media_type || mediaType,
    originalLanguage: movie.original_language,
    releaseDate: movie.release_date || movie.first_air_date,
    originalTitle: movie.original_title || movie.original_name,
  };
};

const searchByIdEndpoint = (mediaId, mediaType, language = 'en-US') =>
  `${TMDB_BASE_URL}/${mediaType}/${mediaId}?api_key=${TMDB_API_KEY}&language=${language}`;

const searchByTitleEndpoint = (title, language = 'en-US') =>
  `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=${language}&page=1&include_adult=true&query=${title}`;

const getPopularEndpoint = (mediaType, language = 'en-US') =>
  `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}&language=${language}&page=1`;

module.exports = {
  mapMediaObject,
  transformResponse,
  getPopularEndpoint,
  searchByIdEndpoint,
  searchByTitleEndpoint,
};
