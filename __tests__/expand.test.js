import { expand } from '../src/index';

describe('expand()', () => {
  test('returns false if passed an invalid object', () => {
    expect(expand(1)).toBe(false);
    expect(expand('42')).toBe(false);
    expect(expand(null)).toBe(false);
    expect(expand(true)).toBe(false);
    expect(expand(false)).toBe(false);
    expect(expand(undefined)).toBe(false);
    expect(expand(NaN)).toBe(false);
    expect(expand(Infinity)).toBe(false);
    expect(expand({})).toBe(false);
    expect(expand({ o: {} })).toBe(false);
    expect(expand({ v: [] })).toBe(false);
  });

  test('expands a flat object of unique, primitive values', () => {
    const uncompressed = {
      a: 'b',
      c: 'd',
      5: 'a'
    };
    const compressed = {
      v: ['5', 'a', 'b', 'c', 'd'],
      o: {
        1: 2,
        3: 4,
        0: 1
      },
    };

    expect(expand(compressed)).toEqual(uncompressed);
  });

  test('expands a flat object containing non-unique, primitive keys/values', () => {
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

    expect(expand(compressed)).toEqual(uncompressed);
  });

  test('expands a flat array of primitive values', () => {
    const uncompressed = ['a', 'b', 'c', 2];
    const compressed = {
      v: ['a', 'b', 'c', 2],
      o: [0, 1, 2, 3],
    };

    expect(expand(compressed)).toEqual(uncompressed);
  });

  test('expands a nested object', () => {
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

    expect(expand(compressed)).toEqual(uncompressed);
  });

  test('expands a nested array of primitives', () => {
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

    expect(expand(compressed)).toEqual(uncompressed);
  });

  test('expands a nested array of objects', () => {
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

    expect(expand(compressed)).toEqual(uncompressed);
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

    expect(expand(compressed)).toEqual(uncompressed);
  });
});
