import express = require('express');
const app: express.Application = express();
const port = 8000
import {CreateRequestBody} from './queryControllers/elasticQueryConverter'
import {SearchElasticQuery} from './elasticConnector'


app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));

let bodyReq = { "fields":["image", "entityId", "metadata" ,"algorithmName","algorithmResults", "updatedAt"], 
"paging":{"from":0,"size":40}};

SearchElasticQuery(CreateRequestBody(bodyReq));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  


