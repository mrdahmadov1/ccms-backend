const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    match: /^\+(?:[0-9] ?){6,14}[0-9]$/,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  adminResponses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Response',
    },
  ],
});

module.exports = mongoose.model('Complaint', complaintSchema);
