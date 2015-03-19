'use strict';

var bytewise = require('bytewise');
var levelup = require('levelup');

// Memoizes an asynchronous function to a db of the given name
// Based on the memoize function from caolan/async
module.exports = function (pathOrDb, fn, hashFn) {
  var db;

  if (typeof pathOrDb === 'string') {
    db = levelup(pathOrDb, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    });
  }
  else if (typeof pathOrDb === 'object') {
    db = pathOrDb;
  }
  else {
    throw new Error('memoize-cache ctor param is not a string or object.');
  }

  var queues = {};

  hashFn = hashFn || function (x) {
    return x;
  };

  function memoized() {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    var key = bytewise.encode(hashFn.apply(null, args));

    db.get(key, function (err, value) {
      if (!err) {
        console.log('Using memoized value:', value);
        return callback.apply(null, JSON.parse(value));
      }

      if (!err.notFound) {
        return callback.apply(err);
      }

      if (key in queues) {
        return queues[key].push(callback);
      }

      queues[key] = [callback];

      fn.apply(null, args.concat([function () {
        var fnArgs = Array.prototype.slice.call(arguments);

        db.put(key, JSON.stringify(fnArgs), function (err) {
          var q = queues[key];
          delete queues[key];

          for (var i = 0, l = q.length; i < l; i++) {
            q[i].apply(err, fnArgs);
          }
        });
      }]));
    });
  }

  memoized.db = db;

  return memoized;
};
