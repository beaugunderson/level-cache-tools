'use strict';

var levelup = require('levelup');
var _ = require('lodash');

module.exports = function (path) {
  this.db = levelup(path);

  this.get = _.bind(this.db.get, this.db);
  this.put = _.bind(this.db.put, this.db);
};
