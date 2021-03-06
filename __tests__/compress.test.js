import { compress } from '../src/index';
import { compress as distCompress } from '../dist/weissman';

describe('compress()', () => {
  test('returns false if passed a non-array or object', () => {
    expect(compress(1)).toBe(false);
    expect(compress('42')).toBe(false);
    expect(compress(null)).toBe(false);
    expect(compress(true)).toBe(false);
    expect(compress(false)).toBe(false);
    expect(compress(undefined)).toBe(false);
    expect(compress(NaN)).toBe(false);
    expect(compress(Infinity)).toBe(false);
  });

  test('compresses a flat object of unique, primitive values', () => {
    const uncompressed = {
      a: 'b',
      c: 'd'
    };
    const compressed = {
      v: ['a', 'b', 'c', 'd'],
      o: {
        0: 1,
        2: 3
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('number values/keys do not overwrite', () => {
    const uncompressed = {
      5: 'a',
      b: 5,
      c: '5',
      '1.2': 'a',
      d: 1.2
    };
    const compressed = {
      v: ['5', 'a', 'b', 5, 'c', '1.2', 'd', 1.2],
      o: {
        0: 1,
        2: 3,
        4: 0,
        5: 1,
        6: 7
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('null values/keys do not overwrite', () => {
    const uncompressed = {
      null: 'a',
      a: null
    };
    const compressed = {
      v: ['null', 'a', null],
      o: {
        0: 1,
        1: 2
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('booleans do not overwrite', () => {
    const uncompressed = {
      true: 'a',
      a: true,
      false: 'b',
      b: false
    };
    const compressed = {
      v: ['true', 'a', true, 'false', 'b', false],
      o: {
        0: 1,
        1: 2,
        3: 4,
        4: 5
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('NaN is respected', () => {
    const uncompressed = {
      a: NaN,
      NaN: 'a'
    };
    const compressed = {
      v: ['a', NaN, 'NaN'],
      o: {
        0: 1,
        2: 0
      },
    };

    expect(JSON.stringify(compress(uncompressed))).toEqual(JSON.stringify(compressed));
  });

  test('compresses a flat object containing non-unique, primitive keys/values', () => {
    const uncompressed = {
      1: 'a',
      a: 'b',
      b: 'c',
      c: 1,
    };
    const compressed = {
      v: ['1', 'a', 'b', 'c', 1],
      o: {
        0: 1,
        1: 2,
        2: 3,
        3: 4
      },
    };

    expect(JSON.stringify(compress(uncompressed))).toEqual(JSON.stringify(compressed));
  });

  test('compresses a flat array of primitive values', () => {
    const uncompressed = ['a', 'b', 'c', 2, null];
    const compressed = {
      v: ['a', 'b', 'c', 2, null],
      o: [0, 1, 2, 3, 4],
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('compresses a nested object', () => {
    const uncompressed = {
      a: 'b',
      b: {
        a: 'c',
      },
    };
    const compressed = {
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: {
          0: 2,
        },
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('compresses a nested array of primitives', () => {
    const uncompressed = {
      a: 'b',
      b: ['a', 'b', 'c', 'c'],
    };
    const compressed = {
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: [0, 1, 2, 2],
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('compresses a nested array of objects', () => {
    const uncompressed = {
      a: 'b',
      b: [
        'a',
        'b',
        {
          d: 1,
        },
        'c',
      ],
    };
    const compressed = {
      v: ['a', 'b', 'd', 1, 'c'],
      o: {
        0: 1,
        1: [0, 1, { 2: 3 }, 4],
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('compresses a nested array of arrays', () => {
    const uncompressed = {
      a: 'b',
      b: [
        'a',
        'b',
        ['d', 1],
        'c',
      ],
    };
    const compressed = {
      v: ['a', 'b', 'd', 1, 'c'],
      o: {
        0: 1,
        1: [0, 1, [2, 3], 4],
      },
    };

    expect(compress(uncompressed)).toEqual(compressed);
  });

  test('minified `compress()` function works', () => {
    const uncompressed = { a: 1, b: '2'};
    const compressed = {
      v: ['a', 1, 'b', '2' ],
      o: { 0: 1, 2: 3 }
    };

    expect(distCompress(uncompressed)).toEqual(compressed);
  });
});
