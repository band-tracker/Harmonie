const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    required: true
  },
  address: {
    type: String
  },
  startTime: {
    type: Date
  },
  beThereTime: {
    type: Date,
    default: function() {
      const time = new Date(this.startTime.getTime());
      return time.setMinutes(time.getMinutes() - 30);
    }
  },
  thingsToBring: {
    type: String
  },
  attire: {
    type: String
  },
  specialMessage: {
    type: String
  },
  music: [String]
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Concert', concertSchema);

