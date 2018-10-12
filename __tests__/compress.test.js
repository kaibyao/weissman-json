const { compress } = require('../index');

describe('compress()', () => {
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

  test('compresses a flat array of string values', () => {
    const uncompressed = ['a', 'b', 'c', 'a'];

    expect(compress(uncompressed)).toEqual({
      v: [0, 'a', 1, 'b', 2, 'c', 3],
      o: [1, 3, 5, 1],
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
      v: ['a', 'b', 0, 1, 2, 'c', 3],
      o: {
        0: 1,
        1: [0, 1, 5, 5],
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
      v: ['a', 'b', 0, 1, 2, 'd', 3, 'c'],
      o: {
        0: 1,
        1: [0, 1, { 5: 3 }, 7],
      },
    });
  });
});
