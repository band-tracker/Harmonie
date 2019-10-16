const express = require('express');
const app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/bands', require('./routes/bands'));
app.use('/api/v1/concerts', require('./routes/concerts'));
app.use('/api/v1/rehearsals', require('./routes/rehearsals'));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('Hey susan!');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));


module.exports = app;
