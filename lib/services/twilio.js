require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
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
            body: `Band-Tracker\nNEW CONCERT INFO!\n\nConcert: ${name}\nLocation: ${address}\nDate: ${startTime.toDateString()} ${formatTime(startTime)}`
          });
        })
      );
    })
    .then(() => console.log('Messages Sent!'));
};


module.exports = sendConcertMessage;
