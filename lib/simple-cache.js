'use strict';

var levelup = require('levelup');

module.exports = function (path) {
  this.db = levelup(path);

  this.get = this.db.get.bind(this.db);
  this.put = this.db.put.bind(this.db);
};
