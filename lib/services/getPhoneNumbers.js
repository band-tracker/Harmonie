const Band = require('../models/Band');
const User = require('../models/User');

function getPhoneNumbers(event) {
  return Band
    .findById(event.bandId)
    .then(band => {
      return Promise.all(band.members.map(userId => {
        return User
          .findById(userId);
      }));
    })
    .then(users => {
      return users.map(user => {
        const phone = user.phone;
        const part1 = phone.slice(1, 4);
        const part2 = phone.slice(6, 9);
        const part3 = phone.slice(10, 14);
        return `+1${part1}${part2}${part3}`;
      });
    });
}

module.exports = getPhoneNumbers;
