function compress(o) {
  // init
  const values = [];
  const valuesIndexMap = {};
  const compressed = {};

  const oKeys = Object.keys(o);

  // Navigate through object and store compressed values
  let i;
  for (i = 0; i < oKeys.length; i++) {
    const oKey = oKeys[i];
    const oVal = o[oKey];

    if (typeof valuesIndexMap[oKey] === 'undefined') {
      values.push(oKey);
      valuesIndexMap[oKey] = values.length - 1;
    }

    if (typeof valuesIndexMap[oVal] === 'undefined') {
      values.push(oVal);
      valuesIndexMap[oVal] = values.length - 1;
    }

    compressed[valuesIndexMap[oKey]] = valuesIndexMap[oVal];
  }

  return {
    v: values,
    o: compressed
  };
}

exports.compress = compress;
