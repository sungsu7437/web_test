/**
 * Created by sss on 2017-03-09.
 */
var express = require('express');
var router = express.Router();

// Connection URL
var host = 'localhost';
var port = 27017;
var dbName = 'test';
var collectionName = 'test_insert';

var MongoDB = require('../data/mongo').MongoDB;

var mongoDB = new MongoDB(dbName, host, port);

router.get('/add', function (req, res, next) {
    mongoDB.findAll(collectionName, function (err, result) {
        res.render('add', {topics:result});
    })
});

router.get('/:id/edit', function (req, res, next) {
    var id = req.params.id;

    mongoDB.findAll(collectionName, function (err, topics) {
        mongoDB.findById(collectionName, id, function (err, topic) {
            return res.render('edit', {topics: topics, topic: topic});
        })
    })
});

router.get('/:id/delete', function (req, res, next) {
    var id = req.params.id;

    mongoDB.findAll(collectionName, function (err, topics) {
        mongoDB.findById(collectionName, id, function (err, topic) {
            res.render('delete', {topics:topics, topic: topic});
        })
    })

});


router.post('/:id/delete', function (req, res, next) {
    var id = req.params.id;

    mongoDB.delete(collectionName, id, function (err, docs) {

        res.redirect('/topic/');
    })
});

router.post('/:id/add', function (req, res, next) {
    var id = req.params.id;
    var description = req.body.description;
    var title = req.body.title;
    var author = req.body.author;

    mongoDB.update(collectionName, id,
        {
            $set: {
                class:"topic",
                description:description,
                title:title, author:author
            }
        }
        , function (err, docs) {
        res.redirect('/topic/' +id);
    })

});

router.get(['/', '/:id'], function (req, res, next) {
    var id = req.params.id;

    if (id) {
        mongoDB.findAll(collectionName, function (err, topics) {
            mongoDB.findById(collectionName, id, function (err, topic) {
                res.render('view', {topics:topics, topic: topic});
            })
        })
    }
    else {
        mongoDB.findAll(collectionName, function (err, result) {
            res.render('view', {topics:result});
        })
    }
});

router.post('/', function (req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;

    mongoDB.save(collectionName, {class:"topic", description:description, title:title, author:author}, function (err, docs) {
        res.redirect('/topic/' +docs['ops'][0]["_id"]);
    })
});

module.exports = router;