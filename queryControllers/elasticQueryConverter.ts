
import esb = require('elastic-builder');
import { string } from 'joi';
var elasticsearch = require('elasticsearch')
var dataConverter = require('./elasticQueryDataConverter');

var client = new elasticsearch.Client({
  hosts: ['http://elastic:elkpass123456!@10.1.0.103:9200'],
  log: 'trace',
  apiVersion: '7.x'
})

const requestBody = esb.requestBodySearch()
  .query(esb.matchQuery('body', 'elasticsearch'));

let boolQuery = esb.boolQuery();
boolQuery.must(esb.matchQuery('entityId', 'dfff-8d6f-461f-b9f5-28a30717c4aa'));
console.log(boolQuery);

 interface LabeledValue {
  "match": { "lpr": string[] } 
}

function CreateRequestBody(bodyReq: LabeledValue) {
  Object.entries(bodyReq["match"]).forEach(
    ([key, value]) => {
      console.log(key, value)
      boolQuery.must(esb.matchQuery(dataConverter.match[key], value[0]));
    }
  );

  console.log(boolQuery);
}



async function Try() {
  client.search({
    index: 'test_index_photos',
    body: requestBody.toJSON()
  }).then(function (resp: any) {
    console.log(resp);
  }, function (err: { message: any; }) {
    console.trace(err.message);
  });
}


export { CreateRequestBody ,Try }