/**
 * Compresses an object or array.
 *
 * @param {Object|Any[]} o An object or array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {Object} [valuesIndexMap={}] internally used to keep track of each key and value’s index in the `values` array
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function compress(o, values = [], valuesIndexMap = {}, isNested = false) {
  if (typeof o !== 'object' || o === null) {
    return false;
  }

  return Array.isArray(o)
    ? _compressArray(o, values, valuesIndexMap, isNested)
    : _compressObject(o, values, valuesIndexMap, isNested);
}
exports.compress = compress;

/**
 * Compresses an array.
 *
 * @param {Any[]} o An array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {Object} [valuesIndexMap={}] internally used to keep track of each key and value’s index in the `values` array
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressArray(o, values, valuesIndexMap, isNested) {
  const compressed = [];

  // preserve the indexes of arrays as numbers, not strings
  const oKeys = o.map((v, i) => i);

  // Navigate through array and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    if (typeof oVal === 'object') {
      compressed.push(compress(oVal, values, valuesIndexMap, true));
    } else {
      _appendToValues(oVal, values, valuesIndexMap);
      compressed.push(valuesIndexMap[oVal]);
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
 * @param {Object} [valuesIndexMap={}] internally used to keep track of each key and value’s index in the `values` array
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressObject(o, values, valuesIndexMap, isNested) {
  const compressed = {};
  const oKeys = Object.keys(o);

  // Navigate through object and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    // add object key to index map if it doesn't exist
    _appendToValues(oKey, values, valuesIndexMap);

    const oKeyIndex = valuesIndexMap[oKey];
    if (typeof oVal === 'object') {
      compressed[oKeyIndex] = compress(oVal, values, valuesIndexMap, true);
    } else {
      // add object value to index map if it doesn't exist
      _appendToValues(oVal, values, valuesIndexMap);
      compressed[oKeyIndex] = valuesIndexMap[oVal];
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
 * Appends a string or number to the values array and index map if it doesn’t already exist.
 *
 * @param {String|Number} val
 * @param {(String|Number)[]} valuesArr
 * @param {Object} valuesIndexMap
 */
function _appendToValues(val, valuesArr, valuesIndexMap) {
  if (typeof valuesIndexMap[val] === 'undefined') {
    // add object value to index map if it doesn't exist
    valuesArr.push(val);
    valuesIndexMap[val] = valuesArr.length - 1;
  }
}
