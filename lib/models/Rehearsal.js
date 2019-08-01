const mongoose = require('mongoose');

const rehearsalSchema = new mongoose.Schema({
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    required: true
  },
  concertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concert',
  },
  address: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  thingsToBring: String,
  specialMessage: String,
  music: [String],
  twilioAlert: Boolean
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Rehearsal', rehearsalSchema);
