# weissman-json

A JSON compression library.

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

## To run tests

```bash
yarn run jest
```

## TODO

* Introduce an option for multi-threaded compression.
