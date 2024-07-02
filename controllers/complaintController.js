const Complaint = require('../models/complaintModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllComplaints = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 10;

  const complaints = await Complaint.find()
    .limit(limit)
    .skip((page - 1) * limit);

  res.status(200).json({
    status: 'success',
    results: complaints.length,
    data: complaints,
  });
});

exports.getComplaint = catchAsync(async (req, res, next) => {
  let complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  if (complaint.adminResponses && complaint.adminResponses.length > 0) {
    complaint = await Complaint.findById(req.params.id).populate({
      path: 'adminResponses',
      options: { sort: { responseDate: -1 } },
    });
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
  const { status, accepted } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (accepted !== undefined) updateFields.accepted = accepted;

  if (Object.keys(updateFields).length === 0) {
    return next(new AppError('Only status or accepted can be updated', 400));
  }

  const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, updateFields, {
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
