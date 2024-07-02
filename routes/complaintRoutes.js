const express = require('express');
const complaintController = require('../controllers/complaintController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(complaintController.getAllComplaints)
  .post(authController.restrictTo('user'), complaintController.createComplaint);

router
  .route('/:id')
  .get(complaintController.getComplaint)
  .patch(authController.restrictTo('admin'), complaintController.updateComplaint)
  .delete(authController.restrictTo('admin'), complaintController.deleteComplaint);

module.exports = router;
