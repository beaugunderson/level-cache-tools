'use strict';

var bytewise = require('bytewise');
var levelup = require('levelup');

// Memoizes an asynchronous function to a db of the given name
// Based on the memoize function from caolan/async
module.exports = function (path, fn, hashFn) {
  var db = levelup(path, {
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  });

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
