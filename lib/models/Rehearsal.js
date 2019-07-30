const mongoose = require('mongoose');

const rehearsalSchema = new mongoose.Schema({
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    require: true
  },
  address: String,
  startTime: Date,
  thingsToBring: String,
  specialMessage: String,
  music: [String]
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Rehearsal', rehearsalSchema);
