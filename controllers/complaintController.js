const Complaint = require('../models/complaintModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllComplaints = catchAsync(async (req, res, next) => {
  const complaints = await Complaint.find();

  res.status(200).json({
    status: 'success',
    results: complaints.length,
    data: complaints,
  });
});

exports.getComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: complaint,
  });
});

exports.createComplaint = catchAsync(async (req, res) => {
  const newComplaint = await Complaint.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newComplaint,
  });
});

exports.updateComplaint = catchAsync(async (req, res, next) => {
  const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedComplaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedComplaint,
  });
});

exports.deleteComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id);

  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
