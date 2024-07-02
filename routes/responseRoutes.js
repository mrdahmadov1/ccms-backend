const express = require('express');
const responseController = require('../controllers/responseController');

const router = express.Router();

router.route('/').post(responseController.createResponse);

router.route('/:id').patch(responseController.updateResponse);

module.exports = router;
