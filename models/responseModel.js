const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  complaintId: {
    type: Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  response: {
    type: String,
    required: true,
    min: 10,
    max: 500,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  responseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', ResponseSchema);
