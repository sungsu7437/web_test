/**
 * Created by sss on 2017-03-15.
 */

var host = 'localhost';
var port = 27017;
var dbName = 'test';
var collectionName = 'test_insert';

var MongoDB = require('./mongo').MongoDB;
var mongoDB = new MongoDB(dbName, host, port);

Topic = function () {
};

Topic.prototype.findAll = function (callback) {
    mongoDB.findAll(collectionName, function (err, userinfo) {
        if (err || !userinfo)
            callback(err);
        else
            callback(null, userinfo);
    })
};

Topic.prototype.findById = function (id, callback) {
    mongoDB.findById(collectionName, id, function (err, userinfo) {
        if (err || !userinfo)
            callback(err);
        else
            callback(null, userinfo);
    })
};

Topic.prototype.save = function (data, callback) {
    mongoDB.save(collectionName, data, function (err, result) {
        if (err || !result)
            callback(err);
        else
            callback(null, result.ops[0]);
    })
};

Topic.prototype.update = function (id, data, callback) {
    mongoDB.update(collectionName, id, data, function (err, result) {
        if (err || !result)
            callback(err);
        else
            callback(null, result);
    })
};

Topic.prototype.delete = function (id, callback) {
    mongoDB.delete(collectionName, id, function (err, result) {
        if (err || !result)
            callback(err);
        else
            callback(null, result);
    })
};

exports.Topic = Topic;

