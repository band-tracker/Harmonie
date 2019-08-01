require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
const seedData = require('./test/seed-data');

mongoose.connection.dropDatabase()
  .then(() => seedData())
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => mongoose.connection.close());
