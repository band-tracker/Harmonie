const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username, 
      password, 
      photoUrl,
      email,
      phone
    } = req.body;

    User
      .create({ username, password, photoUrl, email, phone })
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  });
