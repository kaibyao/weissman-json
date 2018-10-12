const { compress } = require('../index');

describe('compress()', () => {
  test('compresses a flat object of unique string values', () => {
    const uncompressed = {
      a: 'b',
      c: 'd'
    };
    const compressed = compress(uncompressed);

    expect(compressed).toEqual({
      v: ['a', 'b', 'c', 'd'],
      o: {
        0: 1,
        2: 3
      }
    });
  });

  test('compresses a flat object containing non-unique string keys/values', () => {
    const uncompressed = {
      a: 'b',
      b: 'c',
      c: 'a',
    };
    const compressed = compress(uncompressed);

    expect(compressed).toEqual({
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: 2,
        2: 0
      }
    });
  });

  test('compresses a nested object', () => {
    const uncompressed = {
      a: 'b',
      b: {
        a: 'c'
      }
    };
    const compressed = compress(uncompressed);

    expect(compressed).toEqual({
      v: ['a', 'b', 'c'],
      o: {
        0: 1,
        1: {
          0: 2
        }
      }
    });
  });
});
