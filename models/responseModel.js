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
  },
  responseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', ResponseSchema);
