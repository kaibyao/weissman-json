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

    values.push(oKey);
    valuesIndexMap[oKey] = i;

    if (typeof valuesIndexMap[oVal] === 'undefined') {
      values.push(oVal);
      valuesIndexMap[oVal] = values.length - 1;
    }

    compressed[i] = valuesIndexMap[oVal];
  }
}

exports.compress = compress;
