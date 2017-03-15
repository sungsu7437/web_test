/**
 * Created by sss on 2017-03-09.
 */
var express = require('express');
var router = express.Router();

var host = 'localhost';
var port = 27017;
var dbName = 'test';
var collectionName = 'test_insert';

var MongoDB = require('../data/mongo').MongoDB;
var db_topic = new MongoDB(dbName, host, port, collectionName);

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

router.get('/add', loggedIn, function (req, res, next) {
    db_topic.findAll(function (err, topics) {
        if (err || !topics) {
            res.status(500);
        }
        else {
            res.render('add', {topics:topics, author:req.user});
        }
    });
});

router.get('/:id/:author/edit', loggedIn, function (req, res, next) {
    var id = req.params.id;
    var author = req.params.author;

    if (req.user != author) {
        res.redirect('/topic');
    } else {
        db_topic.findById(id, function (err, topic) {
            if (err || !topic) {
                res.status(500);
            }
            else {
                res.render('edit', {topic: topic, author: req.user});
            }
        })
    }
});

    router.get('/:id/delete', loggedIn, function (req, res, next) {//POST로 바꾼다 DELETE 쓸수있으면 쓰셈 GET은 필요할 때만 사용한다. 기준에 맞춰서
    var id = req.params.id;
    //여기서 확인한다.

    db_topic.findById(id, function (err, topic) {
        if (err || !topic) {
            res.status(500);
        }
        else {
            res.render('delete', {topic: topic});
        }
    })
});


router.post('/:id/delete', loggedIn, function (req, res, next) {
    var id = req.params.id;

    if (req.user != req.body.author) {
        res.redirect('/topic');
    } else {
        db_topic.delete(id, function (err, result) {
            if (err || !result) {
                res.status(500);
            }
            else {
                res.redirect('/topic');
            }
        });
    }
});

router.post('/:id/edit', loggedIn, function (req, res, next) {
    var id = req.params.id;

    if (req.user != req.body.author) {
        res.redirect('/topic');
    } else {
        var text = {
            class: "topic",
            title: req.body.title,
            description: req.body.description,
            author: req.user
        };

        db_topic.update(id,
            {$set: text},
            function (err, result) {
                if (err || !result) {
                    res.status(500);
                }
                else {
                    res.redirect('/topic/' + id);
                }
            });
    }
});

router.get(['/', '/:id'], loggedIn, function (req, res, next) {
    var id = req.params.id;

    if (id) {
        db_topic.findById(id, function (err, topic) {
            if (err || !topic) {
                res.status(500);
            }
            else {
                res.render('view', {topic: topic});
            }
        })
    }
    else {
        db_topic.findAll(function (err, topics) {
            if (err || !topics) {
                res.status(500);
            }
            else {
                res.render('view', {topics: topics});
            }
        });
    }
});

router.post('/', loggedIn, function (req, res, next) {
    var text = {
        class:"topic",
        title:req.body.title,
        description:req.body.description,
        author:req.user
    };

    db_topic.save(text, function (err, result) {
            if (err || !result) {
                res.status(500);
            }
            else {
                res.redirect('/topic/' +result["_id"]);
            }
        }
    );
});

module.exports = router;