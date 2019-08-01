const { Router } = require('express');
const Band = require('../models/Band');
const ensureAuth = require('../middleware/ensure-auth');
const { addMemberMessage, deleteMemberMessage } = require('../services/twilio');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const { 
      name,
      address,
      state,
      members,
      description,
      genre
    } = req.body;

    Band
      .create({
        name,
        address,
        state,
        members,
        leaders: [req.user._id],
        description,
        genre
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

  .get('/stats', (req, res, next) => {
    Promise.all([
      Band
        .count(),
      Band
        .getStatesWithMostBands(),
      Band
        .getAverageBandSize(),
      Band
        .getYoungestBands()
    ])
      .then(([totalBands, statesWithMostBands, avgBandSize, youngestBandsByMemberAge]) => {
        res.send({
          totalBands,
          statesWithMostBands,
          avgBandSize: avgBandSize[0].avgBandSize,
          youngestBandsByMemberAge
        });
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Band
      .findById(req.params.id)
      .then(band => res.send(band))
      .catch(next);
  })

  .get('/:id/next-rehearsals', (req, res, next) => {
    Band
      .getNextRehearsals(req.params.id)
      .then(rehearsals => res.send(rehearsals))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const keys = [
      'name',
      'address',
      'description'
    ];

    const update = keys.reduce((acc, key) => {
      const value = req.body[key];
      if(value) acc[key] = value;
      return acc;
    }, {});

    Band
      .findById(req.params.id)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          Band
            .findByIdAndUpdate(req.params.id, update, { new: true })
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

  .patch('/:id/addMember', ensureAuth, (req, res, next) => {
    const { userId, twilioAlert } = req.body;

    Band
      .findById(req.params.id)
      .then(band => {
        if(band.leaders.includes(req.user._id)) {
          Band
            .findByIdAndUpdate(req.params.id, { $push: { members: userId } }, { new: true })
            .then(band => {
              if(twilioAlert) {
                addMemberMessage(userId, band);
              }
              res.send(band);
            })
            .catch(next);
        } else {
          const err = new Error('Action not authorized');
          err.status = 403;
          err.suppress = true;
          next(err); 
        }
      });
  })

  .patch('/:id/deleteMember', ensureAuth, (req, res, next) => {
    const { userId, twilioAlert } = req.body;

    Band
      .findById(req.params.id)
      .then(band => {
        if(band.leaders.includes(req.user._id) && band.members.includes(userId)) {
          Band
            .findByIdAndUpdate(req.params.id, { $pull: { members: userId } }, { new: true })
            .then(band => {
              if(twilioAlert) {
                deleteMemberMessage(userId, band);
              }
              res.send(band);
            })
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
