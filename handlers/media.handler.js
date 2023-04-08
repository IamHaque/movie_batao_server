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

const transformResponse = (response, limit = 10) => {
  return response.data.results
    .map(mapMediaObject)
    .filter(
      ({ title, original_title, poster_path, media_type }) =>
        ['tv', 'movie'].includes(media_type) &&
        !!title &&
        !!poster_path &&
        !!original_title
    )
    .slice(0, limit)
    .sort((a, b) => b.popularity - a.popularity);
};

const mapMediaObject = (movie) => {
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

  return {
    id: movie.id,
    adult: movie.adult,
    overview: movie.overview,
    genres: Array.from(genres),
    popularity: movie.popularity,
    media_type: movie.media_type,
    title: movie.title || movie.name,
    original_language: movie.original_language,
    poster_path: TMDB_IMG_URL + '/w500' + movie.poster_path,
    release_date: movie.release_date || movie.first_air_date,
    original_title: movie.original_title || movie.original_name,
  };
};

const searchByIdEndpoint = (id, media_type, language = 'en-US') =>
  `${TMDB_BASE_URL}/${media_type}/${id}?api_key=${TMDB_API_KEY}&language=${language}`;

const searchByTitleEndpoint = (title, language = 'en-US') =>
  `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=${language}&page=1&include_adult=true&query=${title}`;

module.exports = {
  mapMediaObject,
  transformResponse,
  searchByIdEndpoint,
  searchByTitleEndpoint,
};
