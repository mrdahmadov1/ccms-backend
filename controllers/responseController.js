const cron = require('node-cron');
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

cron.schedule('0 0 * * *', async () => {
  const oneMinuteAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const complaints = await Complaint.find({
      status: 'Open',
      submissionDate: { $lte: oneMinuteAgo },
      adminResponses: { $size: 0 },
    });

    for (const complaint of complaints) {
      const autoResponse = {
        complaintId: complaint._id,
        response: 'Your complaint is received and is being reviewed.',
        rating: 0,
      };

      const newResponse = await Response.create(autoResponse);

      complaint.adminResponses.push(newResponse._id);
      await complaint.save();
    }

    // console.log('Auto-responses sent for unresolved complaints.');
  } catch (err) {
    // console.error('Error in auto-response cron job:', err);
  }
});
