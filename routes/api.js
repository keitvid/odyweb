/**
 * Created by AGromov on 20.07.2016.
 */
var express = require('express');
var router = express.Router();
var sample = require('../sample.json');
var api = require('../controllers/api');

/* GET users listing. */
router.get('/metrics/:schema', function(req, res) {
    res.send(sample);
});

router.get("/settings", function(req, res) {
    api.call("settings/list").then((x) => {
        res.send(x);
    }).catch((err) => {
        console.error(err);
    })
});

router.post('/settings', function(req, res) {
    api.call("settings/create", req.body).then((x) => {
        res.send(x);
    });
});

router.put('/settings/:oid', function(req, res) {
    api.call("settings/save", req.params.oid, req.body).then((x) => {
        res.send(x);
    }).catch((err) => {
        console.error(err);
    });
});

router.delete('/settings/:oid', function(req, res) {
    api.call("settings/delete", req.params.oid).then((x) => {
        res.send(x);
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;
