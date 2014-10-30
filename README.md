[![Build Status](https://travis-ci.org/beaugunderson/node-level-cache-tools.svg?branch=master)](https://travis-ci.org/beaugunderson/node-level-cache-tools)

## level-cache-tools

Three different cache types, backed by leveldb.

### SimpleCache

Just `get` and `put`. Simple.

### MemoizeCache

Memoize an asynchronous function to disk.

### ValueCache

Keep track of whether a value has been used or not.
