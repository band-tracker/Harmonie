require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
let agent = request.agent(app);

describe('users routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates and returns new user', () => {
    return agent
      .post('/api/v1/auth/signup')
      .send({
        username: 'bandaholic',
        password: 'password',
        photoUrl: 'http://photo.jpg',
        email: 'bandaholic@gmail.com',
        phone: '555-555-5555'
      })
      .then(res => {
        console.log(res.header);
        if(res.header) {
          expect(res.header['set-cookie']).toBeDefined();
        }
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'bandaholic',
          photoUrl: 'http://photo.jpg',
          email: 'bandaholic@gmail.com',
          phone: '555-555-5555'
        });
      });
  });
});
