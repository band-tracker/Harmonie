const { getAgent, getUsers } = require('../data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('users routes', () => {
  
  it('creates and returns new user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'bandaholic',
        password: 'password',
        photoUrl: 'http://photo.jpg',
        email: 'bandaholic@gmail.com',
        phone: '(555) 555-5555'
      })
      .then(res => {
        expect(res.header['set-cookie']).toBeDefined();
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'bandaholic',
          photoUrl: 'http://photo.jpg',
          email: 'bandaholic@gmail.com',
          phone: '(555) 555-5555',
          availability: []
        });
      });
  });

  it('signs in a user, returns user', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/auth/signin')
      .send({
        username: user.username,
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          username: user.username,
          photoUrl: user.photoUrl,
          email: user.email,
          phone: user.phone,
          availability: expect.any(Array),
          instrument: expect.any(String),
          instrumentType: expect.any(String),
          age: expect.any(Number)
        });
      });
  });

  it('can verify a user', () => {
    const user = getUsers()[0];
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          username: user.username,
          photoUrl: user.photoUrl,
          email: user.email,
          phone: user.phone,
          availability: expect.any(Array),
          instrument: expect.any(String),
          instrumentType: expect.any(String),
          age: expect.any(Number)
        });
      });
  });
});
