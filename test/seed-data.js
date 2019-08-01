const User = require('../lib/models/User');
const Band = require('../lib/models/Band');
const Concert = require('../lib/models/Concert');
const Rehearsal = require('../lib/models/Rehearsal');
const chance = require('chance').Chance();

const woodwinds = ['clarinet', 'saxophone', 'oboe', 'flute', 'basson', 'bass clarinet'];
const brass = ['trumpet', 'trombone', 'horn', 'euphonium', 'tuba'];
const percussion = 'percussion';
const instruments = [...woodwinds, ...brass, ...percussion];
const genres = ['contemporary', 'modernist', 'experimental', 'cinematic', 'jazz', 'classical', 'impressionist', 'romantic', 'baroque'];

function instrumentType(instrument) {
  if(woodwinds.includes(instrument)) {
    return 'woodwind';
  } else if(brass.includes(instrument)) {
    return 'brass';
  } else {
    return 'percussion';
  }
}

module.exports = async({ users = 10, concertsPerBand = 2, rehearsalsPerConcert = 3, bands = 2 } = {}) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.name(),
      photoUrl: chance.url({ extensions: ['jpg'] }),
      password: 'password',
      email: chance.email(),
      phone: '(555) 555-5555',
      age: chance.age({ type: ['teen', 'adult', 'senior'] }),
      availability: [chance.weekday(), chance.weekday(), chance.weekday()],
      instrument: chance.pickset(instruments)[0],
      instrumentType: instrumentType(this.instrument)
    }))
  );
  
  const userIds = createdUsers.map(user => user._id);

  const createdBands = await Band.create(
    [...Array(bands)].map(() => ({
      name: chance.name(),
      address: chance.address(),
      state: chance.state({ full: true }),
      members: chance.pickset(userIds, chance.integer({ min: 5, max: 100 })),
      leaders: chance.pickset(userIds),
      description: chance.sentence(),
      genre: chance.pickset(genres)[0]
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

  createdBands.unshift(createdBandTwo);
  createdBands.unshift(createdBandOne);

  const createdConcerts = await Concert.create(createdBands.flatMap(band => {
    return [...Array(concertsPerBand)]
      .map(() => ({
        address: chance.address(),
        bandId: band._id,
        name: chance.word(),
        startTime: chance.date(),
        thingsToBring: chance.word(),
        attire: chance.word(),
        specialMessage: chance.sentence(),
        music: [chance.word(), chance.word()]
      }));
  }));

  const createdRehearsals = await Rehearsal.create(createdConcerts.flatMap(concert => {
    return [...Array(rehearsalsPerConcert)]
      .map(() => ({
        bandId: concert.bandId,
        concertId: concert._id,
        address: chance.address(),
        startTime: chance.date(),
        thingsToBring: chance.word(),
        specialMessage: chance.sentence(),
        music: [chance.word(), chance.word()]
      }));
  }));

  return {
    users: createdUsers,
    bands: createdBands,
    concerts: createdConcerts,
    rehearsals: createdRehearsals
  };
};

