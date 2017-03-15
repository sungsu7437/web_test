/**
 * Created by sss on 2017-03-14.
 */
module.exports = function (app) {


    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

    var Passport = require('../data/passport').Passport;
    var db_passport = new Passport();

    // var host = 'localhost';
    // var port = 27017;
    // var dbName = 'test';
    // var collectionName = 'test_auth';
    //
    // var MongoDB = require('../data/mongo').MongoDB;
    // var mongoDB = new MongoDB(dbName, host, port);


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (username, done) {

        db_passport.findByUserName(username, function (err, result) {
            if(err || !result)
                done('There is no user.');
            else
                done(null, result.username);
        })
    });



    passport.use(new LocalStrategy(
        function (username, password, done) {
            var uname = username;
            var pwd = password;

            db_passport.findByUserName(username, function (err, userinfo) {
                if(err || !userinfo)
                    done(null, false);
                else if(userinfo.password == pwd)
                    done(null, userinfo.username);
                else
                    done(null, false);
            })

            // mongoDB.findByUserName(collectionName, username, function (err, userInfo) {
            //     if (err) {
            //         res.send("err");
            //     }
            //     if (userInfo.password == pwd) {
            //         done(null, userInfo);
            //     }
            //     else {
            //         done(null,false);
            //     }
            // })
        }
    ));

    passport.use(new GoogleStrategy({
            clientID:'46031195264-ln9i4q9tdgb0npf9dsjurh87skuvsqu7.apps.googleusercontent.com',
            clientSecret:'qdadtA2LJ_hJ2DRBURe4p1FP',
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile); //profile contains all the personal data returned
            console.log(profile.emails[0].value);
            
            var username = profile.emails[0].value;
            var displayname = profile.displayName;

            db_passport.findByUserName(username, function (err, userinfo) {
                if (err || !userinfo) {
                    //아이디가 존재하지 않는 경우
                    db_passport.save({username:username, displayname:displayname}, function (err, result) {
                        if (err || !result)
                            done('Error');
                        else
                            done(null, result);
                    })
                }
                else {
                    done(null, username);
                }
            })
    }));

    return passport;
}