
import esb = require('elastic-builder');
import { JsonSchema } from './jsonSchema'
var dataConverter = require('./elasticQueryDataConverter');
var elasticFields = require('./elasticFieldDataConverter');

const requestBody = esb.requestBodySearch();
let boolQuery = esb.boolQuery();

function AddQueryMatchFilter(bodyReq: JsonSchema) {
  bodyReq["match"] !== undefined ? Object.entries(bodyReq["match"]!).forEach(
    ([key, value]) => {
      let esbQuery : esb.Query[] = new Array();
      value!.forEach(valueElement=>{
        esbQuery.push(esb.matchQuery(dataConverter.match[key], valueElement));
      })
      boolQuery.must(esb.boolQuery().minimumShouldMatch(1).should(esbQuery));
    }
  ) : undefined;
}

function AddQueryPagingFilter(bodyReq: JsonSchema) {
  Object.entries(bodyReq["paging"]!).forEach(
    ([key, value]) => {
      key === "from" ? requestBody.from(value) : undefined;
      key === "size" ? requestBody.size(value) : undefined;
    }
  );
}

function AddQueryReturnFields(bodyReq: JsonSchema) {
  let sourceIncludes: string[] = [];

  bodyReq["fields"].forEach(element => {
    elasticFields[element] ? sourceIncludes.push(elasticFields[element]) : undefined;
  });

  requestBody.source({ "includes": sourceIncludes, "excludes": ["algorithms.*.results.feature", "algorithms.*.results.landmarks"] });
}

function AddQueryRangeFilter(bodyReq: JsonSchema) {
  bodyReq["range"] !== undefined ? Object.entries(bodyReq["range"]!["date"]!).forEach(
    ([key, value]) => {
      key === "start" ? boolQuery.must(esb.rangeQuery('createdAt').gte(value!)) : undefined;
      key === "end" ? boolQuery.must(esb.rangeQuery('createdAt').lte(value!)) : undefined;
    }
  ) : undefined;
}

function AddQuerySortFilter(bodyReq: JsonSchema) {
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
}



function CreateRequestBody(bodyReq: JsonSchema): esb.RequestBodySearch {
  AddQueryMatchFilter(bodyReq);
  AddQueryPagingFilter(bodyReq);
  AddQueryReturnFields(bodyReq);
  AddQueryRangeFilter(bodyReq);
  AddQuerySortFilter(bodyReq);
  requestBody.query(boolQuery);

  return requestBody;
}

export { CreateRequestBody }