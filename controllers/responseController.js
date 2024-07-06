const Response = require('../models/responseModel');
const Complaint = require('../models/complaintModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createResponse = catchAsync(async (req, res, next) => {
  const newResponse = await Response.create(req.body);

  const complaint = await Complaint.findById(req.body.complaintId);
  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  complaint.adminResponses.push(newResponse._id);
  await complaint.save();

  res.status(201).json({
    status: 'success',
    data: newResponse,
  });
});

exports.updateResponse = catchAsync(async (req, res, next) => {
  const { rating } = req.body;

  if (rating === undefined) {
    return next(new AppError('Only rating can be updated', 400));
  }

  const updatedResponse = await Response.findByIdAndUpdate(
    req.params.id,
    { rating },
    { new: true, runValidators: true }
  );

  if (!updatedResponse) {
    return next(new AppError('No Response found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedResponse,
  });
});
