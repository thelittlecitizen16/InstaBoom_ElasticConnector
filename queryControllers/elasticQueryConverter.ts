
import esb = require('elastic-builder');
import { JsonSchema } from './jsonSchema'
var dataConverter = require('./elasticQueryDataConverter');
var elasticFields = require('./elasticFieldDataConverter');
var config = require('../configuration/config.json')



function AddQueryMatchFilter(bodyReq: JsonSchema, boolQuery: esb.BoolQuery) {
  bodyReq["match"] !== undefined ? Object.entries(bodyReq["match"]!).forEach(
    ([key, value]) => {
      let esbQuery: esb.Query[] = new Array();
      value!.forEach(valueElement => {
        esbQuery.push(esb.matchQuery(dataConverter.match[key], valueElement));
      })
      boolQuery.must(esb.boolQuery().minimumShouldMatch(1).should(esbQuery));
    }
  ) : undefined;
}

function AddQueryPagingFilter(bodyReq: JsonSchema, requestBody: esb.RequestBodySearch) {
  Object.entries(bodyReq["paging"]!).forEach(
    ([key, value]) => {
      key === "from" ? requestBody.from(value) : undefined;
      key === "size" ? requestBody.size(value) : undefined;
    }
  );
}

function AddQueryReturnFields(bodyReq: JsonSchema, requestBody: esb.RequestBodySearch) {
  let sourceIncludes: string[] = [];

  bodyReq["fields"].forEach(element => {
    elasticFields[element] ? sourceIncludes.push(elasticFields[element]) : undefined;
  });

  requestBody.source({ "includes": sourceIncludes, "excludes": config.query.excludes });
}

function AddQueryRangeFilter(bodyReq: JsonSchema, boolQuery: esb.BoolQuery) {
  bodyReq["range"] !== undefined ? Object.entries(bodyReq["range"]!["date"]!).forEach(
    ([key, value]) => {
      key === "start" ? boolQuery.must(esb.rangeQuery('createdAt').gte(value!)) : undefined;
      key === "end" ? boolQuery.must(esb.rangeQuery('createdAt').lte(value!)) : undefined;
    }
  ) : undefined;
}

function AddQuerySortFilter(bodyReq: JsonSchema, requestBody: esb.RequestBodySearch) {
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

function AddQueryAnalyticsFilter(bodyReq: JsonSchema, boolQuery: esb.BoolQuery) {
  bodyReq["analytics"] !== undefined ? Object.entries(bodyReq["analytics"]!).forEach(
    ([key, value]) => {
      value === "have" ? boolQuery.must(esb.existsQuery(dataConverter.analytics[key])) : undefined;
      value === "notHave" ? boolQuery.mustNot(esb.existsQuery(dataConverter.analytics[key])) : undefined;
    }
  ) : undefined;
}

function CreateRequestBody(bodyReq: JsonSchema): esb.RequestBodySearch {
  const requestBody = esb.requestBodySearch();
  let boolQuery = esb.boolQuery();
  AddQueryMatchFilter(bodyReq, boolQuery);
  AddQueryPagingFilter(bodyReq, requestBody);
  AddQueryReturnFields(bodyReq, requestBody);
  AddQueryRangeFilter(bodyReq, boolQuery);
  AddQuerySortFilter(bodyReq, requestBody);
  AddQueryAnalyticsFilter(bodyReq, boolQuery);
  requestBody.query(boolQuery);
  return requestBody;
}

export { CreateRequestBody }