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
  })

  .get('/', (req, res, next) => {
    Band
      .find()
      .then(bands => res.send(bands))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Band
      .findById(req.params.id)
      .then(band => res.send(band))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const {
      name
    } = req.body;

    Band
      .findById(req.params.id)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          Band
            .findByIdAndUpdate(req.params.id, { name }, { new: true })
            .then(band => res.send(band))
            .catch(next);
        } else {
          const err = new Error('Action not authorized');
          err.status = 403;
          err.suppress = true;
          next(err); 
        }
      });
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Band 
      .findById(req.params.id)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          Band
            .findByIdAndDelete(req.params.id)
            .then(band => res.send(band))
            .catch(next);
        } else {
          const err = new Error('Action not authorized');
          err.status = 403;
          err.suppress = true;
          next(err); 
        }
      });
  });
