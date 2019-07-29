require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

let user = null;
let agent = request.agent(app);
beforeEach(async() => {
  user = await User.create({
    username: 'bandaholic2',
    password: 'password',
    photoUrl: 'http://photo.jpg',
    email: 'bandaholic2@gmail.com',
    phone: '555-555-5556'
  });

  return await agent
    .post('/api/v1/auth/signin')
    .send({
      username: user.username,
      password: 'password'
    });
});

afterAll(() => {
  return mongoose.connection.close();
});

module.exports = {
  getAgent: () => agent,
  getUser: () => user
};
