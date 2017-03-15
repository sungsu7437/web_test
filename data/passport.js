/**
 * Created by sss on 2017-03-15.
 */

var host = 'localhost';
var port = 27017;
var dbName = 'test';
var collectionName = 'test_auth';

var MongoDB = require('./mongo').MongoDB;
var mongoDB = new MongoDB(dbName, host, port);

Passport = function () {

};

Passport.prototype.save = function (data, callback) {
    mongoDB.save(collectionName, data, function (err, docs) {
        if (err || !docs)
            callback(err);
        else
            callback(null, docs.ops[0]);
    })
}

Passport.prototype.findByUserName = function (username, callback) {
    mongoDB.findByUserName(collectionName, username, function (err, userinfo) {
        if (err || !userinfo)
            callback(err);
        else
            callback(null, userinfo);
    })
};

exports.Passport = Passport;
