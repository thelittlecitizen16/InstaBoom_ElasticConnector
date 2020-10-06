
import esb = require('elastic-builder');
var elasticsearch = require('elasticsearch')

var client = new elasticsearch.Client({
    hosts: ['http://elastic:elkpass123456!@10.1.0.103:9200'],
    apiVersion: '7.x'
})

async function RemoveTtlFieldFromElastic(id: string) {
    return client.updateByQuery({
        index: 'test_index_photos',
        body: {
            "query": {"term": { "entityId.keyword": id  }},
            "script": "ctx._source.remove('ttl')"
        }
    });
}

async function SearchElasticQuery(requestBody: esb.RequestBodySearch) {
    return client.search({
        index: 'test_index_photos',
        body: requestBody.toJSON()
    });
}

export { SearchElasticQuery, RemoveTtlFieldFromElastic }