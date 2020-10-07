import express = require('express');
var router = express.Router();
import { schemasMiddleware } from './schemas'
import { CreateRequestBody } from '../queryControllers/elasticQueryConverter'
import { SearchElasticQuery, RemoveTtlFieldFromElastic } from '../elasticControllers/elasticConnector'


function CreateError(error : any)
{
    return {"error": error}
}

router.post('/search', schemasMiddleware(), (req, res) => {
    try {
        SearchElasticQuery(CreateRequestBody(req.body))
            .then(function (resp: any) {
                res.json(resp.hits.hits);
            }, function (err: { message: any; }) {
                res.status(404).json(CreateError(err.message))
            });
    } catch (error) {
        res.status(500).json(CreateError(error));
    }
});

router.post('/archive/:id', (req, res) => {
    try {
        RemoveTtlFieldFromElastic(req.params.id).then(function (resp: any) {
            if(resp.updated > 0){
                res.status(201).send(resp);
            }else{
                res.status(404).json(CreateError(`Id Not Found`));
            }
        }, function (err: { message: any; }) {
            res.status(404).json(CreateError(err.message));
        });

    } catch (error) {
        res.status(500).json(CreateError(error));
    }
});

module.exports = router
