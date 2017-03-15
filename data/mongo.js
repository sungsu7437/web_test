/**
 * Created by sss on 2017-03-12.
 */
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

MongoDB = function (dbName, host, port) {
    this.db= new Db(dbName, new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
    this.db.open(function(){});
}

MongoDB.prototype.getCollection= function(collectionName, callback) {
    this.db.collection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else callback(null, collection);
    });
};

//find all data
MongoDB.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.find().toArray(function(err, results) {
                if(err || !results) callback(err);
                else callback(null, results)
            });
        }
    });
};

//find a data by UserName
MongoDB.prototype.findByUserName = function(collectionName, username, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.findOne({username: username}, function(err, result) {
                if(err || !result) callback(err);
                else callback(null, result);
            });
        }
    });
};

//find a data by ID
MongoDB.prototype.findById = function(collectionName, id, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.findOne({_id: ObjectID(id)}, function(err, result) {
                if(err || !result) callback(err);
                else callback(null, result)
            });
        }
    });
};

//insert data
MongoDB.prototype.save = function(collectionName, data, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.insert(data, function(err, result) {
                if(err || !result) callback(err);
                else callback(null, result)
            });
        }
    });
};

//update data, edit data
MongoDB.prototype.update = function(collectionName, id, data, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.update(
                {_id: ObjectID(id)},
                data,
                function(err, result) {
                    if(err || !result) callback(err);
                    else callback(null, result)
                });
        }
    });
};

//delete data
MongoDB.prototype.delete = function(collectionName, id, callback) {
    this.getCollection(collectionName, function(err, collection) {
        if(err || !collection) callback(err);
        else {
            collection.deleteOne({_id: ObjectID(id)}, function(err, result){
                    if(err || !result) callback(err);
                    else callback(null, result)
                });
        }
    });
};

exports.MongoDB = MongoDB;