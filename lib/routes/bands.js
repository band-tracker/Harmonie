const { Router } = require('express');
const Band = require('../models/Band');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const { 
      name,
      address,
      members,
      description
    } = req.body;

    Band
      .create({
        name,
        address,
        members,
        leaders: [req.user._id],
        description
      })
      .then(band => res.send(band))
      .catch(next);
  });
  
