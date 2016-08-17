/**
 * Created by AGromov on 20.07.2016.
 */
var express = require('express');
var router = express.Router();
var sample = require('../sample.json');

/* GET users listing. */
router.get('/metrics/:schema', function(req, res, next) {
    res.send(sample);
});

module.exports = router;
