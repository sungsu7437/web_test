/**
 * Created by sss on 2017-03-09.
 */
var express = require('express');
var router = express.Router();

var Topic = require('../data/topic').Topic;
var db_topic = new Topic();

router.get('/add', function (req, res, next) {
    db_topic.findAll(function (err, topics) {
        if (err || !topics) {
            res.status(500);
        }
        else {
            res.render('add', {topics:topics});
        }
    });
});

router.get('/:id/edit', function (req, res, next) {
    var id = req.params.id;

    db_topic.findAll(function (err, topics) {
        if (err || !topics) {
            res.status(500);
        }
        else {
            db_topic.findById(id, function (err, topic) {
                if (err || !topic) {
                    res.status(500);
                }
                else {
                    res.render('edit', {topics: topics, topic: topic});
                }

            })
        }
    });
});

router.get('/:id/delete', function (req, res, next) {
    var id = req.params.id;

    db_topic.findAll(function (err, topics) {
        if (err || !topics) {
            res.status(500);
        }
        else {
            db_topic.findById(id, function (err, topic) {
                if (err || !topic) {
                    res.status(500);
                }
                else {
                    res.render('delete', {topics: topics, topic: topic});
                }
            })
        }
    });
});


router.post('/:id/delete', function (req, res, next) {
    var id = req.params.id;

    db_topic.delete(id, function (err, result) {
        if (err || !result) {
            res.status(500);
        }
        else {
            res.redirect('/topic');
        }
    });
});

router.post('/:id/add', function (req, res, next) {
    var id = req.params.id;
    var description = req.body.description;
    var title = req.body.title;
    var author = req.body.author;

    db_topic.update(id,
        {
            $set: {
                class:"topic",
                description:description,
                title:title, author:author
            }
        }
        , function (err, result) {
            if (err || !result) {
                res.status(500);
            }
            else {
                res.redirect('/topic/' +id);
            }
        });
});

router.get(['/', '/:id'], function (req, res, next) {
    var id = req.params.id;

    if (id) {
        db_topic.findAll(function (err, topics) {
            if (err || !topics) {
                res.status(500);
            }
            else {
                db_topic.findById(id, function (err, topic) {
                    if (err || !topic) {
                        res.status(500);
                    }
                    else {
                        res.render('view', {topics: topics, topic: topic});
                    }
                })
            }
        });
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

router.post('/', function (req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;

    db_topic.save(
        {
            class:"topic",
            description:description,
            title:title, author:author
        }
        , function (err, result) {
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