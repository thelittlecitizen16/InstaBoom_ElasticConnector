import express = require('express');
const app: express.Application = express();
const port = 8000
import {CreateRequestBody, Try} from './queryControllers/elasticQueryConverter'


app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));
let bodyReq = { "match": { "lpr": ["6455196"] } };

CreateRequestBody(bodyReq);//.catch(console.log);
Try();
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  


