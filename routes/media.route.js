const express = require('express');

const router = express.Router();
const MovieController = require('../controllers/media.controller');

const { catchErrors } = require('../handlers/error.handler');

router.get('/', MovieController.greet);

router.post('/searchById', catchErrors(MovieController.searchById));
router.post('/searchByTitle', catchErrors(MovieController.searchByTitle));

module.exports = router;
