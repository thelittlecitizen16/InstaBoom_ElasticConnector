import express = require('express');
var router = express.Router();
import {schemasMiddleware} from './schemas'

router.post('/search',schemasMiddleware(), (req, res) => {
    try {
        console.log("aa");
    } catch (error) {
        res.status(400).send();
    }
});


module.exports = router
