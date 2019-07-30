const { Router } = require('express');
const Concert = require('../models/Concert');
const ensureAuth = require('../middleware/ensure-auth');
const Band = require('../models/Band');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      address,
      bandId,
      startTime,
      thingsToBring,
      attire,
      specialMessage,
      music
    } = req.body;
    
    Band  
      .findById(bandId)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          Concert
            .create({ address, bandId, startTime, thingsToBring, attire, specialMessage, music })
            .then(concert => res.send(concert))
            .catch(next);
        } else {
          const err = new Error('Action not authorized');
          err.status = 403;
          err.suppress = true;
          next(err); 
        }
      });
  })

  .get('/', (req, res, next) => {
    Concert
      .find()
      .then(concerts => res.send(concerts))
      .catch(next);
  })

  .get('/byband/:id', (req, res, next) => {
    Concert
      .find({ bandId: req.params.id })
      .then(concerts => res.send(concerts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Concert
      .findById(req.params.id)
      .then(concert => res.send(concert))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    const keys = [
      'name', 
      'address', 
      'startTime', 
      'beThereTime',
      'thingsToBring',
      'attire',
      'specialMessage',
      'music'
    ];

    const update = keys.reduce((acc, key) => {
      const value = req.body[key];
      if(value) acc[key] = value;
      return acc;
    }, {});

    Concert
      .findById(req.params.id)
      .then(concert => {
        Band
          .findById(concert.bandId.toString())
          .then(band => {
            if(band.leaders.includes(req.user._id)) {
              Concert
                .findByIdAndUpdate(req.params.id, update, { new: true })
                .then(concert => res.send(concert))
                .catch(next);
            } else {
              const err = new Error('Action not authorized');
              err.status = 403;
              err.suppress = true;
              next(err); 
            }
          });
      });
  });



