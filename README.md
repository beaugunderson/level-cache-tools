[![Build Status](https://travis-ci.org/beaugunderson/node-level-cache-tools.svg?branch=master)](https://travis-ci.org/beaugunderson/node-level-cache-tools)

## level-cache-tools

Three different cache types, backed by leveldb.

### SimpleCache

Just `get` and `put`. Simple.

### MemoizeCache

Memoize an asynchronous function to disk.

If you have a Twitter bot that gets sentences from news stories, for example,
you could memoize the news story retrieval function with the URL as the key
like so:

```js
function newsStory(url, cb) {
  request.get(url, function (err, response, body) {
    cb(body);
  });
}

var memoizedNewsStory = new MemoizeCache('news-stories', newsStory);

// 1st call is not cached, this call stores it to disk via leveldb
memoizedNewsStory('http://cnn.com/blah', console.log);

// 2nd call is cached, retrieved from leveldb rather than hitting the network
memoizedNewsStory('http://cnn.com/blah', console.log);
```

### ValueCache

Keep track of whether a value has been used or not.

Let's say you have a Twitter bot that composes tweets from a corpus of
sentences and you don't want it to repeat itself. You can store values swith
`put()` and query if they've been previously used with `contains()`.

To keep trying until an unused value is found you could use `async.detect` or
`async.detectSeries`:

```js
var usedCandidates = new ValueCache('used-candidates');

// mark 'a' as used
usedCandidates.put('a', function (err) {
  var candidates = ['a', 'b', 'c'];

  async.detectSeries(candidates, usedCandidates.contains, function (result) {
    // result should equal 'b'
  });
});
```

TODO: Move the above example to ValueCache as `firstUnused()`?
