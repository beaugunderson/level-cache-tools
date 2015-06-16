'use strict';

var async = require('async');
var path = require('path');
var should = require('chai').should();
var rimraf = require('rimraf');
var levelup = require('levelup');

var MemoizeCache = require('..').MemoizeCache;

var PATH = path.join(__dirname, 'memoize-cache');

var ABC = 'abc';
var DEF = 'def';

rimraf.sync(PATH);

function asyncFn(key, cb) {
  setTimeout(function () {
    cb(null, key + DEF);
  }, 50);
}

describe('MemoizeCache', function () {
  it('should memoize an async function correctly', function (cb) {
    var memoizedFn = new MemoizeCache(PATH, asyncFn);

    asyncFn(ABC, function (ignoredErr, result) {
      result.should.equal(ABC + DEF);

      async.times(5, function (nKey, nextKey) {
        async.times(50, function (n, next) {
          memoizedFn(nKey + ABC, function (err, result) {
            if (err) {
              return cb(err);
            }

            should.equal(result, nKey + ABC + DEF);

            next();
          });
        }, function (err) {
          nextKey(err);
        });
      }, function (err) {
        cb(err);
      });
    });
  });

  describe('Construct with db', function dbCtorSuite() {
    var altCachePath = path.join(__dirname, 'alternative-cache');

    before(function cleanUp() {
      rimraf.sync(altCachePath);
    });

    it('should create a memoized function using the DB.', function dbCtor() {
      var db = levelup(path.join(__dirname, 'alternative-cache'));
      var memoizedFn = new MemoizeCache(db, asyncFn);
      memoizedFn.should.be.a('function');
    });
  });  
});
