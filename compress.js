const indexOf = require('lodash/indexOf');

/**
 * Compresses an object or array.
 *
 * @param {Object|Any[]} o An object or array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function compress(o, values = [], isNested = false) {
  if (typeof o !== 'object' || o === null) {
    return false;
  }

  return Array.isArray(o)
    ? _compressArray(o, values, isNested)
    : _compressObject(o, values, isNested);
}
exports.compress = compress;

/**
 * Appends a string or number to the values array and index map if it doesn’t already exist. Returns the index of the value.
 *
 * @param {String|Number} val
 * @param {(String|Number)[]} valuesArr
 * @returns {Number} The index of the value
 */
function _appendToValues(val, valuesArr) {
  const i = indexOf(valuesArr, val);

  if (i === -1) {
    valuesArr.push(val);
    return valuesArr.length - 1;
  }

  return i;
}

/**
 * Compresses an array.
 *
 * @param {Any[]} o An array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressArray(o, values, isNested) {
  const compressed = [];

  // preserve the indexes of arrays as numbers, not strings
  const oKeys = o.map((_v, i) => i);

  // Navigate through array and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    if (typeof oVal === 'object') {
      compressed.push(compress(oVal, values, true));
    } else {
      const valIndex = _appendToValues(oVal, values);
      compressed.push(valIndex);
    }
  }

  return isNested
    ? compressed
    : {
        v: values,
        o: compressed,
      };
}

/**
 * Compresses an array.
 *
 * @param {Object} o An object
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressObject(o, values, isNested) {
  const compressed = {};
  const oKeys = Object.keys(o);

  // Navigate through object and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    // add object key to index map if it doesn't exist
    const oKeyIndex = _appendToValues(oKey, values);

    if (typeof oVal === 'object') {
      compressed[oKeyIndex] = compress(oVal, values, true);
    } else {
      // add object value to index map if it doesn't exist
      compressed[oKeyIndex] = _appendToValues(oVal, values);
    }
  }

  return isNested
    ? compressed
    : {
        v: values,
        o: compressed,
      };
}
