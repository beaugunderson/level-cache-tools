'use strict';

require('chai').should();

var path = require('path');
var rimraf = require('rimraf');
var levelup = require('levelup');

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

  describe('Construct with db', function dbCtorSuite() {
    var altCachePath = path.join(__dirname, 'alternative-cache');

    before(function cleanUp() {
      rimraf.sync(altCachePath);
    });

    it('should create a cache using the provided DB.', function dbCtor() {
      var db = levelup(altCachePath);
      var dbCache = new SimpleCache(db);
      dbCache.should.be.an('object');
      dbCache.get.should.be.a('function');
      dbCache.put.should.be.a('function');
    });
  });
});
