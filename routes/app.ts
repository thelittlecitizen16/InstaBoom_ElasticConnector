import express = require('express');
import cors = require('cors');
const app: express.Application = express();
var config = require('../configuration/config.json')

const port = config.server.port;
var coreOptions = {
  origin: config.corsAllowed,
  optionsSuccessStatus: 200
}

app.use(cors(coreOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



