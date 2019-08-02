require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const User = require('../models/User');

const formatTime = require('./formatTime');
const getPhoneNumbers = require('./getPhoneNumbers');

const sendConcertMessage = (concert) => {
  const {
    address,
    name,
    startTime,
  } = concert;
  getPhoneNumbers(concert)
    .then(phoneNumbers => {
      return Promise.all(
        phoneNumbers.map(number => {
          return client.messages.create({
            to: number,
            from: process.env.MY_TWILIO_NUMBER,
            body: `Harmonie App\nNEW CONCERT INFO!\n\nConcert: ${name}\nLocation: ${address}\nDate: ${startTime.toDateString()} ${formatTime(startTime)}`
          });
        })
      );
    })
    .then(() => console.log('Messages Sent!'));
};

const sendRehearsalMessage = (rehearsal) => {
  const {
    address,
    startTime
  } = rehearsal;
  getPhoneNumbers(rehearsal)
    .then(phoneNumbers => {
      return Promise.all(
        phoneNumbers.map(number => {
          return client.messages.create({
            to: number,
            from: process.env.MY_TWILIO_NUMBER,
            body: `Harmonie App\nNEW REHEARSAL INFO!\n\nLocation: ${address}\nDate: ${startTime.toDateString()} ${formatTime(startTime)}`
          });
        })
      );  
    })
    .then(() => console.log('Messages Sent!'));
};

const addMemberMessage = (userId, band) => {
  User  
    .findById(userId)
    .then(user => {
      const phone = user.phone;
      const part1 = phone.slice(1, 4);
      const part2 = phone.slice(6, 9);
      const part3 = phone.slice(10, 14);
      const newNum = `+1${part1}${part2}${part3}`;
      return client.messages.create({
        to: newNum,
        from: process.env.MY_TWILIO_NUMBER,
        body: `Harmonie App\n${user.username}, you're now a member of ${band.name}, practice makes permanent...`
      });
    });
};

const deleteMemberMessage = (userId, band) => {
  User  
    .findById(userId)
    .then(user => {
      const phone = user.phone;
      const part1 = phone.slice(1, 4);
      const part2 = phone.slice(6, 9);
      const part3 = phone.slice(10, 14);
      const newNum = `+1${part1}${part2}${part3}`;
      return client.messages.create({
        to: newNum,
        from: process.env.MY_TWILIO_NUMBER,
        body: `Harmonie App\n${user.username}, you didn't make the cut for ${band.name}, not everyone is perfect...`
      });
    });
};

module.exports = { 
  sendConcertMessage,
  sendRehearsalMessage,
  addMemberMessage,
  deleteMemberMessage
};
