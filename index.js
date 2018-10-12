function compress(o, values = [], valuesIndexMap = {}, isNested = false) {
  const compressed = {};
  const oKeys = Object.keys(o);

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

    if (typeof oVal === 'object') {
      if (Array.isArray(oVal)) {
        // is array
        // TO DO
      } else {
        // is object
        compressed[valuesIndexMap[oKey]] = compress(oVal, values, valuesIndexMap, true);
      }
    } else {
      if (typeof valuesIndexMap[oVal] === 'undefined') {
        // add object value to index map if it doesn't exist
        values.push(oVal);
        valuesIndexMap[oVal] = values.length - 1;
      }

      compressed[valuesIndexMap[oKey]] = valuesIndexMap[oVal];
    }
  }

  return isNested ? compressed : {
    v: values,
    o: compressed
  };
}

exports.compress = compress;
