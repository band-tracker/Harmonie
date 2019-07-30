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

  it('can update a band by id if user is leader', () => {
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

  it('can add a band member to a band', () => {
    const band = getBands()[0];
    const userToAdd = getUsers()[1];
    const updatedMembers = band.members.slice();
    updatedMembers.push(userToAdd._id);

    return getAgent()
      .patch(`/api/v1/bands/${band._id}/addMember`)
      .send({ userId: userToAdd._id })
      .then(res => {
        expect(res.body).toEqual({ ...band, members: updatedMembers });
      });
  });

  it('can delete a band member to a band', () => {
    const band = getBands()[0];
    const memberLength = band.members.length;
    const userToDelete = getUsers()[2];

    return getAgent()
      .patch(`/api/v1/bands/${band._id}/deleteMember`)
      .send({ userId: userToDelete._id })
      .then(res => {
        expect(res.body.members.length).toEqual(memberLength - 1);
      });
  });

  it('can delete a band by id if user is leader', () => {
    const band = getBands()[0];

    return getAgent()
      .delete(`/api/v1/bands/${band._id}`)
      .then(res => {
        expect(res.body).toEqual(band);
      });
  });

  it('cannot delete a band by id if not leader', () => {
    const band = getBands()[1];

    return getAgent()
      .delete(`/api/v1/bands/${band._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Action not authorized',
          status: 403
        });
      });
  });
});
