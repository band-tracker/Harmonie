require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

client.messages.create({
  to: process.env.MY_PHONE_NUMBER,
  from: process.env.MY_TWILIO_NUMBER,
  body: 'this is a text message 😊 https://www.google.com/maps/place/Alchemy+Code+Lab/@45.5234203,-122.6830733,17z/data=!3m1!4b1!4m5!3m4!1s0x54950a0f90bed80f:0x6fa9633757879d6e!8m2!3d45.5234166!4d-122.6808845'
})
  .then((message) => console.log(message.sid));
