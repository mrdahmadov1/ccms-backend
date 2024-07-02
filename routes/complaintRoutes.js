const express = require('express');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

router
  .route('/')
  .get(complaintController.getAllComplaints)
  .post(complaintController.createComplaint);

router
  .route('/:id')
  .get(complaintController.getComplaint)
  .patch(complaintController.updateComplaint)
  .delete(complaintController.deleteComplaint);

module.exports = router;
