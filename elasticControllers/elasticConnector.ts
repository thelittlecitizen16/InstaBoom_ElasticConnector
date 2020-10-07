
import esb = require('elastic-builder');
var elasticsearch = require('elasticsearch')
var config = require('../configuration/config.json')

var client = new elasticsearch.Client({
    hosts: config.elastic.hosts,
    apiVersion: config.elastic.apiVersion
})

async function RemoveTtlFieldFromElastic(id: string) {
    return client.updateByQuery({
        index: config.elastic.index,
        body: {
            "query": {"term": { "entityId.keyword": id  }},
            "script": "ctx._source.remove('ttl')"
        }
    });
}

async function SearchElasticQuery(requestBody: esb.RequestBodySearch) {
    return client.search({
        index: config.elastic.index,
        body: requestBody.toJSON()
    });
}

export { SearchElasticQuery, RemoveTtlFieldFromElastic }