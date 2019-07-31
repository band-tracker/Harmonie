const { Router } = require('express');
const Concert = require('../models/Concert');
const ensureAuth = require('../middleware/ensure-auth');
const Band = require('../models/Band');
const Rehearsal = require('../models/Rehearsal');
const { sendRehearsalMessage } = require('../services/twilio');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      address,
      bandId,
      concertId,
      startTime,
      thingsToBring,
      specialMessage,
      music,
      twilioAlert
    } = req.body;
    
    Band  
      .findById(bandId)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          if(concertId) {
            Concert
              .findById(concertId)
              .then(concert => {
                if(concert) {
                  Rehearsal
                    .create({ address, bandId, concertId, startTime, thingsToBring, specialMessage, music, twilioAlert })
                    .then(rehearsal => {
                      if(rehearsal.twilioAlert) {
                        sendRehearsalMessage(rehearsal);
                      }
                      res.send(rehearsal);
                    })
                    .catch(next);
                } else {
                  const err = new Error('Concert ID is not valid');
                  err.status = 403;
                  err.suppress = true;
                  next(err); 
                }
              });
          } else {
            Rehearsal
              .create({ address, bandId, startTime, thingsToBring, specialMessage, music, twilioAlert })
              .then(rehearsal => {
                if(rehearsal.twilioAlert) {
                  sendRehearsalMessage(rehearsal);
                }
                res.send(rehearsal);
              })
              .catch(next);
          }
        } else {
          const err = new Error('Action not authorized');
          err.status = 403;
          err.suppress = true;
          next(err); 
        }
      });
  })

  .get('/', (req, res, next) => {
    Rehearsal
      .find()
      .then(rehearsals => res.send(rehearsals))
      .catch(next);
  })

  .get('/byband/:id', (req, res, next) => {
    Rehearsal
      .find({ bandId: req.params.id })
      .then(rehearsals => res.send(rehearsals))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Rehearsal
      .findById(req.params.id)
      .then(rehearsal => res.send(rehearsal))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    const keys = [
      'address', 
      'startTime', 
      'thingsToBring',
      'specialMessage',
      'music'
    ];

    const update = keys.reduce((acc, key) => {
      const value = req.body[key];
      if(value) acc[key] = value;
      return acc;
    }, {});

    Rehearsal
      .findById(req.params.id)
      .then(rehearsal => {
        Band
          .findById(rehearsal.bandId.toString())
          .then(band => {
            if(band.leaders.includes(req.user._id)) {
              Rehearsal
                .findByIdAndUpdate(req.params.id, update, { new: true })
                .then(rehearsal => {
                  if(rehearsal.twilioAlert) {
                    sendRehearsalMessage(rehearsal);
                  }
                  res.send(rehearsal);
                })
                .catch(next);
            } else {
              const err = new Error('Action not authorized');
              err.status = 403;
              err.suppress = true;
              next(err); 
            }
          });
      });
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Rehearsal
      .findById(req.params.id)
      .then(rehearsal => {
        Band
          .findById(rehearsal.bandId.toString())
          .then(band => {
            if(band.leaders.includes(req.user._id)) {
              Rehearsal
                .findByIdAndDelete(req.params.id)
                .then(deletedRehearsal => res.send(deletedRehearsal))
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



