const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  address: {
    type: String
  }, 
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  leaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  description: {
    type: String
  }
});

module.exports = mongoose.model('Band', bandSchema);
