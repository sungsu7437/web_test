/**
 * Created by sss on 2017-03-09.
 */

module.exports = function (passport) {

    var express = require('express');
    var router = express.Router();

    var host = 'localhost';
    var port = 27017;
    var dbName = 'test';
    var collectionName = 'test_auth';
    var collectionName2 = 'test_insert';

    var MongoDB = require('../data/mongo').MongoDB;
    var Auth = new MongoDB(dbName, host, port, collectionName);

    router.get('/', function(req, res, next) {
    });

    router.get('/login', function(req, res, next) {
        res.render('login');
    });


    router.get('/register/:id/:pw/:name', function(req, res, next) {
        var user = {
            username:req.params.id,
            password:req.params.pw,
            displayname:req.params.name
        };
        Test.findAll(function (err, result) {
            if (err || !result) {
                res.status(500);
            }
            else {
                console.log(result);
            }
        });

        Auth.save(user, function (err, docs) {
            if (err)
                res.send("이미 존재하는 id 입니다.");
            else
                res.send(docs);
        });
    });


    router.get('/count', function (req, res, next) {
        if (req.session.count) {
            req.session.count++;
        }else {
            req.session.count = 1;
        }
        res.send('count : '+req.session.count);
    });

    router.post('/login',
        passport.authenticate(
            'local', {
                successRedirect: '/topic',
                failureRedirect: '/auth/login',
                failureFlash: false
            }
        )
    );

    router.get('/google',
        passport.authenticate(
            'google', {
                scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            }));

    router.get('/google/callback',
        passport.authenticate(
            'google', {
                successRedirect: '/topic',
                failureRedirect: '/auth/login',
                failureFlash: false
        })
    );

    router.get('/welcome', function (req, res, next) {
        if(req.user) {
            res.send(req.session);
        } else {
            res.send('who are you? <a href="/auth/login">login</a>');
        }
    });

    router.get('/logout', function (req, res, next) {
        req.logout();
        req.session.save(function () {
            res.redirect('/auth/welcome');
        })
    });

    return router;
}