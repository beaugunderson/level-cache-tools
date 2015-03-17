'use strict';

var levelup = require('levelup');

module.exports = function (pathOrDb) {
  if (typeof pathOrDb === 'string') {
    this.db = levelup(pathOrDb);
  }
  else if (typeof pathOrDb === 'object') {
    this.db = pathOrDb;
  }
  else {
    throw new Error('simple-cache ctor param is not a string or object.');
  }

  this.close = this.db.close.bind(this.db);

  this.get = this.db.get.bind(this.db);
  this.put = this.db.put.bind(this.db);
};
