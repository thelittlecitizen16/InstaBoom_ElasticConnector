
import esb = require('elastic-builder');
import {JsonSchema} from './jsonSchema'
var dataConverter = require('./elasticQueryDataConverter');
var elasticFields = require('./elasticFieldDataConverter');

const requestBody = esb.requestBodySearch();
let boolQuery = esb.boolQuery();

function CreateRequestBody(bodyReq: JsonSchema) : esb.RequestBodySearch {
  bodyReq["match"] !== undefined ? Object.entries(bodyReq["match"]!).forEach(
    ([key, value]) => {
      console.log(key, value)
      boolQuery.must(esb.matchQuery(dataConverter.match[key], value![0]));
    }
  ) : undefined;

  Object.entries(bodyReq["paging"]!).forEach(
    ([key, value]) => {
      key === "from" ? requestBody.from(value) : undefined;
      key === "size" ? requestBody.size(value) : undefined;
    }
  );

  let sourceIncludes: string[] = [];
  bodyReq["fields"].forEach(element => {
    elasticFields[element] ? sourceIncludes.push(elasticFields[element]) : undefined;
  });
  requestBody.source({ "includes": sourceIncludes, "excludes": ["algorithms.*.results.feature", "algorithms.*.results.landmarks"] })

  bodyReq["range"] !== undefined ? Object.entries(bodyReq["range"]!["date"]!).forEach(
    ([key, value]) => {
      key === "start" ? boolQuery.must(esb.rangeQuery('createdAt').gte(value!)) : undefined;
      key === "end" ? boolQuery.must(esb.rangeQuery('createdAt').lte(value!)) : undefined;
    }
  ) : undefined;

  if (bodyReq["sort"] !== undefined) {
    let dateType;
    let order;
    Object.entries(bodyReq["sort"]!).forEach(
      ([key, value]) => {
        key === "dateType" ? dateType = value : undefined;
        key === "order" ? order = value : undefined;
      }
    );
    requestBody.sort(esb.sort(dateType, order))
  }

  requestBody.query(boolQuery);

  return requestBody;
}

export { CreateRequestBody }