# weissman-json

A JSON compression library.

## What it does

This library recursively scans an object, takes every key and value and stores them into an array, and replaces them with their array index.

```javascript
import { compress } from 'weissman-json';

const uncompressed = {
  a: 'b',
  c: 'd',
  e: {
    a: 'b'
  },
  f: ['a', 'b', 'c']
};

const compressed = compress(uncompressed);

console.log(compressed);
/*
{
  v: ['a', 'b', 'c', 'd', 'e', 'f']
  o: {
    0: 1,
    2: 3,
    4: {
      0: 1
    },
    5: [0, 1, 2]
  }
}

// v is for values, o is for object
*/
```

## TODO

* Introduce an option for multi-threaded compression.

## Thanks to

* HBO’s Silicon Valley for inspiration on this library’s name.
