import express = require('express');
var router = express.Router();
import { schemasMiddleware } from './schemas'
import { CreateRequestBody } from './queryControllers/elasticQueryConverter'
import { SearchElasticQuery, RemoveTtlFieldFromElastic } from './elasticConnector'

router.post('/search', schemasMiddleware(), (req, res) => {
    try {
        SearchElasticQuery(CreateRequestBody(req.body))
            .then(function (resp: any) {
                res.json(resp.hits.hits);
            }, function (err: { message: any; }) {
                res.status(404).json(err.message);
            });
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/archive/:id', (req, res) => {
    try {
        RemoveTtlFieldFromElastic(req.params.id).then(function (resp: any) {
            res.status(201).send(resp);
        }, function (err: { message: any; }) {
            res.status(404).json(err.message);
        });

    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router
