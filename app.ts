import express = require('express');
const app: express.Application = express();
const port = 8000
import {CreateRequestBody} from './queryControllers/elasticQueryConverter'
import {SearchElasticQuery} from './elasticConnector'


app.use(express.json());
app.use(express.urlencoded());
app.use(require('./router'));

let bodyReq = { "match":{"lpr":["6455196","2352432"],"sensorId":["122","66"]}, "fields":["image", "entityId", "metadata" ,"algorithmName","algorithmResults", "updatedAt"], 
"paging":{"from":0,"size":10}, "range":{"date":{"start":"2020-06-13T15:27:12"}}};

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  


