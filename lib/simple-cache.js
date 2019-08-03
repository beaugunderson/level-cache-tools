'use strict';

var leveldown = require('leveldown');
var levelup = require('levelup');

module.exports = function (path) {
  this.db = levelup(leveldown(path));

  this.close = this.db.close.bind(this.db);

  this.get = function (key, cb) {
    this.db.get(key, {asBuffer: false}, cb);
  };

  this.put = this.db.put.bind(this.db);
};
