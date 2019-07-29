const User = require('../lib/models/User');
const Band = require('../lib/models/Band');
const chance = require('chance').Chance();

module.exports = async({ users = 10 } = {}) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.name(),
      photoUrl: chance.url({ extensions: ['jpg'] }),
      password: 'password',
      email: chance.email(),
      phone: chance.phone()
    }))
  );

  const createdBandOne = await Band.create({
    name: chance.name(),
    address: chance.address(),
    members: [createdUsers[2]._id, createdUsers[3]._id, createdUsers[4]._id, createdUsers[5]._id],
    leaders: [createdUsers[0]._id],
    description: chance.sentence()
  });

  const createdBandTwo = await Band.create({
    name: chance.name(),
    address: chance.address(),
    members: [createdUsers[2]._id, createdUsers[6]._id, createdUsers[7]._id, createdUsers[8]._id, createdUsers[9]._id],
    leaders: [createdUsers[1]._id],
    description: chance.sentence()
  });

  return {
    users: createdUsers,
    bands: [createdBandOne, createdBandTwo]
  };
};

