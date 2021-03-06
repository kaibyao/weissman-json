export { compress };
export default compress;

/**
 * @typedef {Object} IndexMap internally used as temporary storage for the indexes that values have
 * @property {{ nan: Number, number: Object, other: Object }} indexes
 * @property {Object.<string, string>} typeMap Contains information about which index map stores a value based on type. The storage for value indexes have to be grouped by type because of objects that contain a number as a key as well as a value. Because numbers are typecasted as strings when used as keys in an object, having a number as a key and a value would cause the index of the value to overwrite.
 */

/**
 * Compresses an object or array.
 *
 * @param {Object|Any[]} o An object or array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {IndexMap} [indexMap] internally used to store the indexes that values have
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function compress(
  o,
  values = [],
  indexMap = {
    indexes: { nan: -1, number: {}, string: {}, other: {} },
    typeMap: {
      number: 'number',
      string: 'string',
      object: 'other', // null
      undefined: 'other',
      boolean: 'other',
    },
  },
  isNested = false
) {
  if (typeof o !== 'object' || o === null) {
    return false;
  }

  return Array.isArray(o)
    ? _compressArray(o, values, indexMap, isNested)
    : _compressObject(o, values, indexMap, isNested);
}

/**
 * Appends a string or number to the values array and index map if it doesn’t already exist. Returns the index of the value.
 *
 * @param {String|Number} val
 * @param {(String|Number)[]} valuesArr
 * @param {IndexMap} [indexMap] internally used to store the indexes that values have
 * @returns {Number} The index of the value
 */
function _appendToValues(val, valuesArr, indexMap) {
  if (isNaN(val) && typeof val === 'number') {
    if (indexMap.indexes.nan === -1) {
      valuesArr.push(val);
      indexMap.indexes.nan = valuesArr.length - 1;
    }

    return indexMap.indexes.nan;
  } else {
    const valType = typeof val;
    const indexType = indexMap.typeMap[valType];
    const valIndex = indexMap.indexes[indexType][val];

    if (typeof valIndex === 'undefined') {
      valuesArr.push(val);
      indexMap.indexes[indexType][val] = valuesArr.length - 1;
      return indexMap.indexes[indexType][val];
    }

    return valIndex;
  }
}

/**
 * Compresses an array.
 *
 * @param {Any[]} o An array
 * @param {Array.<string|number>} [values=[]] internally used to store the keys and values that have been traversed
 * @param {IndexMap} [indexMap] internally used to store the indexes that values have
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressArray(o, values, indexMap, isNested) {
  const compressed = [];

  // preserve the indexes of arrays as numbers, not strings
  const oKeys = o.map((_v, i) => i);

  // Navigate through array and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    if (typeof oVal === 'object' && oVal !== null) {
      compressed.push(compress(oVal, values, indexMap, true));
    } else {
      const valIndex = _appendToValues(oVal, values, indexMap);
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
 * @param {IndexMap} [indexMap] internally used to store the indexes that values have
 * @param {boolean} [isNested=false] internally used to track if a recursively-called instance of the function should return the fully compressed object or just the compressed object
 * @returns {{ v: Array.<string|number>, o: Object|Any[] }} The compressed version of the original object
 */
function _compressObject(o, values, indexMap, isNested) {
  const compressed = {};
  const oKeys = Object.keys(o);

  // Navigate through object and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    // add object key to index map if it doesn't exist
    const oKeyIndex = _appendToValues(oKey, values, indexMap);

    if (typeof oVal === 'object' && oVal !== null) {
      compressed[oKeyIndex] = compress(oVal, values, indexMap, true);
    } else {
      // add object value to index map if it doesn't exist
      compressed[oKeyIndex] = _appendToValues(oVal, values, indexMap);
    }
  }

  return isNested
    ? compressed
    : {
        v: values,
        o: compressed,
      };
}
