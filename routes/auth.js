/**
 * Created by sss on 2017-03-09.
 */

// var Auth = require('');

module.exports = function (passport) {

    var express = require('express');
    var router = express.Router();
    var Auth = require('../data/auth').Auth;
    var Auth = new Auth();

    router.get('/', function(req, res, next) {
    });

    router.get('/login', function(req, res, next) {
        res.render('login');
    });


    router.get('/register/:id/:pw/:name', function(req, res, next) {
        var id = req.params.id;
        var pw = req.params.pw;
        var name = req.params.name;

        Auth.save({username:id, password:pw, displayname:name}, function (err, docs) {
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


    // router.post('/login', function (req, res, next) {
    //     var username = req.body.username;
    //     var pwd = req.body.password;
    //
    //
    //     mongoDB.findByUserName(collectionName, username, function (err, userInfo) {
    //         if (userInfo.username == username && userInfo.password == pwd) {
    //             req.session.displayName = userInfo.displayname;
    //             req.session.save(function () {
    //                 res.redirect('/auth/welcome');
    //             })
    //         }
    //         else {
    //             res.send('who are you? <a href="/auth/login">login</a>');
    //         }
    //     })
    // });

    router.get('/welcome', function (req, res, next) {
        if(req.user) {
            res.send(req.session);
        } else {
            res.send('who are you? <a href="/auth/login">login</a>');
        }
    })

    router.get('/logout', function (req, res, next) {

        req.logout();
        req.session.save(function () {
            res.redirect('/auth/welcome');
        })
    })

    return router;
}