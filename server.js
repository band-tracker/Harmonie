require('dotenv').config();
require('./lib/utils/connect')();
const http = require('http');

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

http.createServer(app).listen(1330, () => {
  console.log('Port 1330');
});


