'use strict';

var async = require('async');
var bytewise = require('bytewise');
var levelup = require('levelup');
var timestamp = require('monotonic-timestamp');

var ValueCache = module.exports = function (path) {
  this.db = levelup(path, {valueEncoding: 'binary'});
};

ValueCache.prototype.without = function (values, cb) {
  async.reject(values, this.contains.bind(this), cb);
};

ValueCache.prototype.contains = function (value, cb) {
  var stream = this.db.createValueStream();

  stream.on('data', function (data) {
    if (bytewise.decode(data) !== value) {
      return;
    }

    // If we find the data it's used
    stream.destroy();

    cb(true);
  });

  stream.on('error', function (err) {
    throw err;
  });

  // If we haven't found the value yet it's unused
  stream.on('end', function () {
    cb(false);
  });
};

ValueCache.prototype.put = function (value, cb) {
  this.db.put(timestamp(), bytewise.encode(value), cb);
};

ValueCache.prototype.putMulti = function (values, cb) {
  async.each(values, this.put.bind(this), cb);
};
