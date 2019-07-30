const { getAgent, getBands, getConcerts } = require('../data-helpers');

describe('concert routes', () => {
  it('creates and returns new concert', () => {
    const band = getBands()[0];
    return getAgent()
      .post('/api/v1/concerts')
      .send({
        bandId: band._id,
        address: '123 X tree lane',
        startTime: new Date('August 25, 2019 11:30:25'),
        thingsToBring: 'stuff'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          bandId: band._id,
          address: '123 X tree lane',
          startTime: new Date('August 25, 2019 11:30:25').toISOString(),
          beThereTime: new Date('August 25, 2019 11:00:25').toISOString(),
          thingsToBring: 'stuff',
          music: []
        });
      });
  });

  it('get all concerts ', () => {
    const concerts = getConcerts();

    return getAgent()
      .get('/api/v1/concerts')
      .then(res => {
        concerts.forEach(concert => {
          expect(res.body).toContainEqual(concert);
        });
      });
  });

  it('can get all concerts by band id', () => {
    const band = getBands()[0];
    const concerts = getConcerts();
    const filteredConcerts = concerts.filter(concert => {
      return concert.bandId === band._id;
    });

    return getAgent()
      .get(`/api/v1/concerts/byband/${band._id}`)
      .then(res => {
        filteredConcerts.forEach(concert => {
          expect(res.body).toContainEqual(concert);
        });
      });
  });

  it('get concert by id', () => {
    const concert = getConcerts()[0];
    return getAgent()
      .get(`/api/v1/concerts/${concert._id}`)
      .then(res => {
        expect(res.body).toEqual(concert);
      });
  });

  it('updates concert by id if user is leader', () => {
    const concert = getConcerts()[0];
    return getAgent()
      .patch(`/api/v1/concerts/${concert._id}`)
      .send({ name: 'Cool Cucumber Concert' })
      .then(res => {
        expect(res.body).toEqual({ ...concert, name: 'Cool Cucumber Concert' });
      });
  });

  it('cannot update concert by id if user is not a leader', () => {
    const concert = getConcerts()[2];
    return getAgent()
      .patch(`/api/v1/concerts/${concert._id}`)
      .send({ name: 'Cool Cucumber Concert' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Action not authorized',
          status: 403,
        });
      });
  });
});

