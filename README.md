# weissman-json

A JSON compression library.

```bash
yarn add weissman-json
```

## What it does

This library recursively scans an object, takes every key and value and stores them into an array, and replaces them with their array index.

### To compress

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
  v: ['a', 'b', 'c', 'd', 'e', 'f'],
  o: {
    0: 1,
    2: 3,
    4: {
      0: 1
    },
    5: [0, 1, 2]
  }
}
*/
```

### To decompress/expand

```javascript
import { expand } from 'weissman-json';

const compressed = {
  v: ['a', 'b', 'c', 'd', 'e', 'f'],
  o: {
    0: 1,
    2: 3,
    4: {
      0: 1
    },
    5: [0, 1, 2]
  }
};

const uncompressed = expand(compressed);

console.log(uncompressed);
/*
{
  a: 'b',
  c: 'd',
  e: {
    a: 'b'
  },
  f: ['a', 'b', 'c']
}
*/

```

## For browser usage too!

```html
<script src="weissman.js"></script>
<script>
  const json = { a: 'b', c: 'd' };
  const compressed = weissman.compress(json);
  console.log(compressed); //=> { o: { 0: 1, 2: 3 }, v: ['a', 'b', 'c', 'd'] }
</script>
```

## Some caveats

The (compressed and then) expanded JSON will match the original, uncompressed JSON in keys and values, but the keys will not necessarily be in the same order as in the original JSON.

If for some reason you need the order of the keys to match, don’t use this library.

## Why another JSON compression tool?

The ones I’ve tried don’t offer the same level of simplicity, compression, or speed. This tool can compress a 55MB json file down to 28MB in ~1000ms on my Macbook Pro, which was my use case. Also, there’s only two functions to know in order to be productive: `compress()`, and `expand()`. That’s it.

## To run tests

```bash
yarn run jest
```

## TODO

* Introduce an option for multi-threaded compression.
