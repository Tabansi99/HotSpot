import { api } from "./api";
const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost'
const port = 3000
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use('/api', api);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('server ready!')
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1); 
});

// when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port })
