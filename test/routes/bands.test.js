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
});
