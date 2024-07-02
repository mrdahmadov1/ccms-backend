const express = require('express');
const responseController = require('../controllers/responseController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(authController.restrictTo('admin'), responseController.createResponse);

router.route('/:id').patch(authController.restrictTo('user'), responseController.updateResponse);

module.exports = router;
