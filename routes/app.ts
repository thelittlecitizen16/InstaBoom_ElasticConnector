import express = require('express');
const app: express.Application = express();
var config = require('../configuration/config.json')
const port = config.server.port

app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



