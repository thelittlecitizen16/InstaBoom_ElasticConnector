
import esb = require('elastic-builder');
var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
  hosts: ['http://elastic:elkpass123456!@10.1.0.103:9200'],
  log: 'trace',
  apiVersion: '7.x'
})


async function SearchElasticQuery(requestBody : esb.RequestBodySearch) {
  client.search({
    index: 'test_index_photos',
    body: requestBody.toJSON()
  }).then(function (resp: any) {
    console.log(resp);
  }, function (err: { message: any; }) {
    console.trace(err.message);
  });
}

export { SearchElasticQuery }