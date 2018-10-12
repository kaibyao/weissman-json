function compress(o, values = [], valuesIndexMap = {}, isNested = false) {
  // isArr determines the behavior of how values are added to the compressed object/array
  const isArr = Array.isArray(o);

  // the compressed object/array has to be the same type as the original
  const compressed = isArr ? [] : {};

  // preserve the indexes of arrays as numbers, not strings
  const oKeys = isArr ? o.map((v, i) => i) : Object.keys(o);

  // Navigate through object and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    if (typeof valuesIndexMap[oKey] === 'undefined') {
      // add object key to index map if it doesn't exist
      values.push(oKey);
      valuesIndexMap[oKey] = values.length - 1;
    }

    const oKeyIndex = valuesIndexMap[oKey];

    if (typeof oVal === 'object') {
      if (isArr) {
        compressed.push(compress(oVal, values, valuesIndexMap, true));
      } else {
        compressed[oKeyIndex] = compress(oVal, values, valuesIndexMap, true);
      }
    } else {
      if (typeof valuesIndexMap[oVal] === 'undefined') {
        // add object value to index map if it doesn't exist
        values.push(oVal);
        valuesIndexMap[oVal] = values.length - 1;
      }

      const oValIndex = valuesIndexMap[oVal];

      if (isArr) {
        compressed.push(oValIndex);
      } else {
        compressed[oKeyIndex] = oValIndex;
      }
    }
  }

  return isNested ? compressed : {
    v: values,
    o: compressed
  };
}

exports.compress = compress;
