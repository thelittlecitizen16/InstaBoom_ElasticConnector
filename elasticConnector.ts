
import esb = require('elastic-builder');
var elasticsearch = require('elasticsearch')

var client = new elasticsearch.Client({
    hosts: ['http://elastic:elkpass123456!@10.1.0.103:9200'],
    apiVersion: '7.x'
})

async function SearchElasticQuery(requestBody: esb.RequestBodySearch) {
    return client.search({
        index: 'test_index_photos',
        body: requestBody.toJSON()
    });
}

export { SearchElasticQuery }