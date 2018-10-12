/**
 * Takes a compressed object and returns the original uncompressed variable.
 *
 * @param {Any} c The compressed object
 * @returns {Object|Any[]} The original, uncompressed object or array
 */
function expand(c = {}, v = [], isNested = false) {
  let values;
  let o;

  if (!isNested) {
    // parent level
    if (!_isValid(c)) {
      return false;
    }

    values = c.v;
    o = c.o;
  } else {
    // nested, just inherit values
    values = v;
    o = c;
  }

  return Array.isArray(o)
    ? _expandArray(o, values)
    : _expandObject(o, values);
}
exports.expand = expand;

function _expandArray(o, values) {
  const orig = [];
  // const oKeys = o.map((_v, i) => i);

  let i;
  for (i = 0; i < o.length; i++) {
    // const oKey = oKeys[i];
    // const key = values[oKey];
    // const oVal = o[oKey];
    const val = typeof o[i] === 'object' ? expand(o[i], values, true) : values[o[i]];

    orig[i] = val;
  }

  return orig;
}

function _expandObject(o, values) {
  const orig = {};
  const oKeys = Object.keys(o);

  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const key = values[oKey];
    const oVal = o[oKey];
    const val = (typeof oVal === 'object') ? expand(oVal, values, true) : values[oVal];

    orig[key] = val;
  }

  return orig;
}

/**
 * Determines if the compressed object is valid.
 *
 * @param {Object|Any[]} c
 */
function _isValid(c) {
  if (typeof c !== 'object' || c === null) {
    return false;
  }

  const { v, o } = c;

  if (!Array.isArray(v) || typeof o !== 'object') {
    return false;
  }

  return true;
}
