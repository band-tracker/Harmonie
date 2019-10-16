const { getAgent, getBands, getConcerts, getRehearsals } = require('../data-helpers');

describe('rehearsal routes', () => {
  it('creates and returns new rehearsal', () => {
    const concert = getConcerts()[0];
    
    return getAgent()
      .post('/api/v1/rehearsals')
      .send({
        bandId: concert.bandId,
        concertId: concert._id,
        address: '123 X tree lane',
        startTime: new Date('August 25, 2019 11:30:25'),
        thingsToBring: 'stuff'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          bandId: concert.bandId,
          concertId: concert._id,
          address: '123 X tree lane',
          startTime: new Date('August 25, 2019 11:30:25').toISOString(),
          thingsToBring: 'stuff',
          music: []
        });
      });
  });

  it('get all rehearsals ', () => {
    const rehearsals = getRehearsals();

    return getAgent()
      .get('/api/v1/rehearsals')
      .then(res => {
        rehearsals.forEach(rehearsal => {
          expect(res.body).toContainEqual(rehearsal);
        });
      });
  });

  it('can get all rehearsals by band id', () => {
    const band = getBands()[0];
    const rehearsals = getRehearsals();
    const filteredRehearsals = rehearsals.filter(rehearsal => {
      return rehearsal.bandId === band._id;
    });

    return getAgent()
      .get(`/api/v1/rehearsals/byband/${band._id}`)
      .then(res => {
        filteredRehearsals.forEach(rehearsal => {
          expect(res.body).toContainEqual(rehearsal);
        });
      });
  });

  it('gets rehearsal by id', () => {
    const rehearsal = getRehearsals()[0];
    return getAgent()
      .get(`/api/v1/rehearsals/${rehearsal._id}`)
      .then(res => {
        expect(res.body).toEqual(rehearsal);
      });
  });

  it('updates rehearsal by id if user is leader', () => {
    const rehearsal = getRehearsals()[0];
    return getAgent()
      .patch(`/api/v1/rehearsals/${rehearsal._id}`)
      .send({ address: '09897 Westview Drive' })
      .then(res => {
        expect(res.body).toEqual({ ...rehearsal, address: '09897 Westview Drive' });
      });
  });

  it('cannot update concert by id if user is not a leader', () => {
    const rehearsal = getRehearsals()[6];
    return getAgent()
      .patch(`/api/v1/rehearsals/${rehearsal._id}`)
      .send({ address: '09897 Westview Drive' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Action not authorized',
          status: 403,
        });
      });
  });

  it('can delete a rehearsal by id if the user is the leader', () => {
    const rehearsal = getRehearsals()[0];

    return getAgent()
      .delete(`/api/v1/rehearsals/${rehearsal._id}`)
      .then(res => {
        expect(res.body).toEqual(rehearsal);
      });
  });

  it('cannnot delete a concert by id if not leader', () => {
    const rehearsal = getRehearsals()[6];

    return getAgent()
      .delete(`/api/v1/rehearsals/${rehearsal._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Action not authorized',
          status: 403,
        });
      });
  });
});

