const { getAgent, getUsers, getBands } = require('../data-helpers');

describe('bands routes', () => {
  it('creates and returns new band', () => {
    const users = getUsers();
    return getAgent()
      .post('/api/v1/bands')
      .send({
        name: 'Susan Metal',
        address: '123 FakeSusan St',
        members: [users[4]._id, users[5]._id, users[6]._id],
        leaders: [users[0]._id],
        description: 'a band of clarinets'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Susan Metal',
          address: '123 FakeSusan St',
          members: [users[4]._id, users[5]._id, users[6]._id],
          leaders: [users[0]._id],
          description: 'a band of clarinets'
        });
      });
  });

  it('get all bands', () => {
    const bands = getBands();

    return getAgent()
      .get('/api/v1/bands')
      .then(res => {
        expect(res.body).toEqual(bands);
      });
  });

  it('can get a band by its id', () => {
    const band = getBands()[0];

    return getAgent()
      .get(`/api/v1/bands/${band._id}`)
      .then(res => {
        expect(res.body).toEqual(band);
      });
  });

  it('can update a band by id', () => {
    const band = getBands()[0];

    return getAgent()
      .patch(`/api/v1/bands/${band._id}`)
      .send({ name: 'just SUSAN' })
      .then(res => {
        expect(res.body).toEqual({ ...band, name: 'just SUSAN' });
      });
  });

  it('cannot update a band by id if user is not a leader', () => {
    const band = getBands()[1];

    return getAgent()
      .patch(`/api/v1/bands/${band._id}`)
      .send({ name: 'just SUSAN' })
      .then(res => {
        expect(res.body).toEqual({ 
          message: 'Action not authorized',
          status: 403,
        });
      });
  });
});
