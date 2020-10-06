import express = require('express');
var router = express.Router();
import {schemasMiddleware} from './schemas'
import {CreateRequestBody} from './queryControllers/elasticQueryConverter'
import {SearchElasticQuery} from './elasticConnector'
import { SlowBuffer } from 'buffer';

router.post('/search',schemasMiddleware(), (req, res) => {
    try {
        SearchElasticQuery(CreateRequestBody(req.body))
        .then(function (resp: any) {
            res.json(resp.hits.hits);
            return  resp.hits.hits;
          }, function (err: { message: any; }) {
            res.json(err.message);
            return err.message;
          });
    } catch (error) {
        res.status(400).send();
    }
});


module.exports = router
