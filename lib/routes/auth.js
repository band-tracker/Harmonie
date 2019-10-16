const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username, 
      password, 
      photoUrl,
      email,
      phone,
      age, 
      availability,
      instrument
    } = req.body;

    User
      .create({ username, password, photoUrl, email, phone, age, availability, instrument })
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const {
      username,
      password
    } = req.body;

    User.findOne({ username })
      .then(user => {
        if(!user) {
          const err = new Error('Invalid username/password');
          err.status = 401;
          return next(err);
        }
        const isValidPassword = user.compare(password);

        if(isValidPassword) {
          const token = user.authToken();
          res.cookie('session', token);
          res.send(user);
        } else {
          const err = new Error('Invalid username/password');
          err.status = 401;
          next(err);
        }
      });
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });