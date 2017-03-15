/**
 * Created by sss on 2017-03-15.
 */

var host = 'localhost';
var port = 27017;
var dbName = 'test';
var collectionName = 'test_auth';

var MongoDB = require('./mongo').MongoDB;
var mongoDB = new MongoDB(dbName, host, port);

Auth = function () {

};

Auth.prototype.save = function (data, callback) {
    mongoDB.save(collectionName, data, function (err, docs) {
        if (err)
            callback(err);
        else
            callback(null, docs.ops[0]);
    })
};

Auth.prototype.findByUserName = function (username, pwd, callback) {
    mongoDB.findByUserName(collectionName, username, function (err, userinfo) {
        if (err)
            callback(err);
        else if (userinfo.username == username && userinfo.digestPassword == pwd) {
            callback(null, userinfo.displayname);
        }
        else {
            callback(err);
        }
    })
};


exports.Auth = Auth;