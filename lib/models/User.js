const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  photoUrl: String,
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      }
    },
    required: true,
    unique: true
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\(\d{3}\) \d{3}-\d{4}/.test(v);
      },
      required: true,
      unique: true
    }
  },
  age: Number,
  availability: [String],
  instrument: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
    }
  }
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

userSchema.methods.authToken = function() {
  const token = jwt.sign(this.toJSON(), process.env.APP_SECRET, { expiresIn: '24h' });
  return token;
};

userSchema.methods.compare = function(clearPassword) {
  return bcrypt.compareSync(clearPassword, this.passwordHash);
};

userSchema.statics.findByToken = function(token) {
  const payload = jwt.verify(token, process.env.APP_SECRET);
  return this.findOne({ username: payload.username });
};

module.exports = mongoose.model('User', userSchema);
