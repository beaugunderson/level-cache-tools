'use strict';

require('chai').should();

var path = require('path');
var rimraf = require('rimraf');

var SimpleCache = require('..').SimpleCache;

var PATH = path.join(__dirname, 'simple-cache');

rimraf.sync(PATH);

var cache = new SimpleCache(PATH);

describe('SimpleCache', function () {
  describe('put()', function () {
    it('should put a cache item', function (cb) {
      cache.put('abc', 'def', cb);
    });
  });

  describe('get()', function () {
    it('should get a put cache item', function (cb) {
      cache.get('abc', function (err, value) {
        if (err) {
          return cb(err);
        }

        value.should.equal('def');

        cb();
      });
    });
  });
});
