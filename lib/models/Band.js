const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  address: {
    type: String
  }, 
  state: String,
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
  },
  genre: String,
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

bandSchema.statics.getStatesWithMostBands = function() {
  return this.aggregate([
    { $match: { state: { $exists: true } } }, 
    { $group: { _id: '$state', bandsPerState: { $sum: 1 } } }, 
    { $sort: { 'bandsPerState': -1 } }
  ]);
};

bandSchema.statics.getAverageBandSize = function() {
  return this.aggregate([
    { $project: { bandSize: { $size: '$members' } } }, 
    { $group: { _id: null, avgBandSize: { $avg: '$bandSize' } } }, 
    { $project: { _id: false } }
  ]);
};

bandSchema.statics.getYoungestBands = function() {
  return this.aggregate([
    { $unwind: { path: '$members' } }, 
    { $lookup: { from: 'users', localField: 'members', foreignField: '_id', as: 'memberInfo' } }, 
    { $unwind: { path: '$memberInfo' } }, 
    { $group: { _id: '$_id', membersAverageAge: { $avg: '$memberInfo.age' } } }, 
    { $lookup: { from: 'bands', localField: '_id', foreignField: '_id', as: 'bandInfo' } }, 
    { $unwind: { path: '$bandInfo' } }, 
    { $project: { membersAverageAge: true, bandName: '$bandInfo.name', _id: false } }, 
    { $sort: { 'membersAverageAge': 1 } }
  ]);
};

module.exports = mongoose.model('Band', bandSchema);
