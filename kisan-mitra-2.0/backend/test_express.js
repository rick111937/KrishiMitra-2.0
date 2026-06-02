const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
const server = app.listen(5000, () => console.log('Listening on 5000'));

// Keep it alive for 10 seconds to verify
setTimeout(() => {
  console.log('Finished test');
  server.close();
  process.exit(0);
}, 10000);
