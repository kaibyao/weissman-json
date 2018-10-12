const { compress } = require('../index');

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

  test('compresses a flat object of unique string values', () => {
    const uncompressed = {
      a: 'b',
      c: 'd',
    };

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'c', 'd'],
      o: {
        0: 1,
        2: 3,
      },
    });
  });

  test('compresses a flat object containing non-unique string keys/values', () => {
    const uncompressed = {
      a: 'b',
      b: 'c',
      c: 'a',
    };

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: 2,
        2: 0,
      },
    });
  });

  test('compresses a flat array of primitive values', () => {
    const uncompressed = ['a', 'b', 'c', 2];

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'c', 2],
      o: [0, 1, 2, 3],
    });
  });

  test('compresses a nested object', () => {
    const uncompressed = {
      a: 'b',
      b: {
        a: 'c',
      },
    };

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: {
          0: 2,
        },
      },
    });
  });

  test('compresses a nested array of primitives', () => {
    const uncompressed = {
      a: 'b',
      b: ['a', 'b', 'c', 'c'],
    };

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: [0, 1, 2, 2],
      },
    });
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

    expect(compress(uncompressed)).toEqual({
      v: ['a', 'b', 'd', 1, 'c'],
      o: {
        0: 1,
        1: [0, 1, { 2: 3 }, 4],
      },
    });
  });
});
