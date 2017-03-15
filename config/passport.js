/**
 * Created by sss on 2017-03-14.
 */
module.exports = function (app) {


    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

    var host = 'localhost';
    var port = 27017;
    var dbName = 'test';
    var collectionName = 'test_auth';

    var MongoDB = require('../data/mongo').MongoDB;
    var mongoDB = new MongoDB(dbName, host, port);


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });



    passport.use(new LocalStrategy(
        function (username, password, done) {
            var uname = username;
            var pwd = password;

            mongoDB.findByUserName(collectionName, username, function (err, userInfo) {
                if (err) {
                    res.send("err");
                }
                if (userInfo.password == pwd) {
                    done(null, userInfo);
                }
                else {
                    done(null,false);
                }
            })
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
            done(null, profile)
    }));

    return passport;
}