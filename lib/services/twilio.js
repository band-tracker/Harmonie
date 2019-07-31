require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const formatTime = require('./formatTime');

const Band = require('../models/Band');
const User = require('../models/User');


const sendConcertMessage = (concert) => {
  const {
    address,
    name,
    startTime,
  } = concert;
  
  Band
    .findById(concert.bandId)
    .then(async(band) => {
      await Promise.all(band.members.map(userId => {
        return User
          .findById(userId);
      }))
        .then(users => {
          const phoneNumbers = users.map(user => {
            const phone = user.phone;
            const part1 = phone.slice(1, 4);
            const part2 = phone.slice(6, 9);
            const part3 = phone.slice(10, 14);
            return `+1${part1}${part2}${part3}`;
          });
          Promise.all(
            phoneNumbers.map(number => {
              return client.messages.create({
                to: number,
                from: process.env.MY_TWILIO_NUMBER,
                body: `Band-Tracker\nNEW CONCERT INFO!\n\nConcert: ${name}\nLocation: ${address}\nDate: ${startTime.toDateString()} ${formatTime(startTime)}`
              });
            })
          )
            .then(() => console.log('Messages Sent!'));
        });
    });
};

module.exports = sendConcertMessage;
