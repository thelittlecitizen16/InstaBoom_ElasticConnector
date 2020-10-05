import express = require('express');
var router = express.Router();

router.post('/search',(req, res) => {
    try {
               
    } catch (error) {
        res.status(400).send();
    }
});

module.exports = router
