const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user.controller');

const { catchErrors } = require('../handlers/error.handler');

router.post('/getByEmail', catchErrors(UserController.getUser));
router.post('/create', catchErrors(UserController.createUser));

module.exports = router;
