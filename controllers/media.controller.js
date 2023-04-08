const axios = require('axios');
const MovieHandler = require('../handlers/media.handler');

module.exports.greet = (req, res) => {
  res.json({
    message: 'Welcome to MovieBatao',
  });
};

/**
 * Returns media object against passed ID
 *
 * @requires {id} id: id of the searched media
 * @requires {media_type} media_type: type of the searched media (tv or movie)
 * @optional {language} language: language of the response object
 */
module.exports.searchById = async (req, res, next) => {
  const language = req.body.language;

  const { id, media_type } = req.body;
  if (!id) return next(new Error('id is required'));
  if (!media_type) return next(new Error('media_type is required'));
  if (!['tv', 'movie'].includes(media_type))
    return next(new Error('invalid media_type'));

  const response = await axios({
    method: 'get',
    url: MovieHandler.searchByIdEndpoint(id, media_type, language),
  });

  if (!response.data) return next(new Error('error fetching data'));

  const result = MovieHandler.mapMediaObject(response.data);
  result.media_type = media_type;
  res.json(result);
};

/**
 * Returns a list of media objects containing searched title
 *
 * @requires {title} title: title of the searched media
 * @optional {language} language: language of the response object
 */
module.exports.searchByTitle = async (req, res, next) => {
  const language = req.body.language;

  const title = req.body.title;
  if (!title) return next(new Error('title is required'));

  const response = await axios({
    method: 'get',
    url: MovieHandler.searchByTitleEndpoint(title, language),
  });

  if (!response.data || !response.data.results)
    return next(new Error('error fetching data'));

  const results = MovieHandler.transformResponse(response);
  res.json(results);
};
