'use strict';

require('chai').should();

var path = require('path');
var rimraf = require('rimraf');
var ValueCache = require('..').ValueCache;
var levelup = require('levelup');

var PATH = path.join(__dirname, 'value-cache');

rimraf.sync(PATH);

var strings = new ValueCache(PATH);

var HELLO_WORLD = 'hello world';

describe('ValueCache', function () {
  describe('contains()', function () {
    it('should return false when an item has not been stored', function (cb) {
      strings.contains(HELLO_WORLD, function (contains) {
        contains.should.equal(false);

        cb();
      });
    });

    it('should return true when an item as been stored', function (cb) {
      strings.put(HELLO_WORLD, function (err) {
        if (err) {
          return cb(err);
        }

        strings.put(HELLO_WORLD, function (err) {
          if (err) {
            return cb(err);
          }

          strings.contains(HELLO_WORLD, function (contains) {
            contains.should.equal(true);

            cb();
          });
        });
      });
    });
  });

  describe('Construct with db', function dbCtorSuite() {
    var altCachePath = path.join(__dirname, 'alternative-cache');

    before(function cleanUp() {
      rimraf.sync(altCachePath);
    });

    it('should create a value cache using the DB.', function dbCtor() {
      var db = levelup(path.join(__dirname, 'alternative-cache'));
      var strings = new ValueCache(db);
      strings.should.be.an('object');
      strings.contains.should.be.a('function');
      strings.put.should.be.a('function');
      db.close();
    });
  });
});
