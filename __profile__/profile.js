/* global weissman */

const d = document;
let json;
let jsonCompressed;
// let jsonExpanded;

d.querySelector('#save').addEventListener('click', loadJson);
d.querySelector('#compress').addEventListener('click', testCompress);
d.querySelector('#expand').addEventListener('click', testExpand);

//////

function loadJson() {
  const file = _getFile();

  const reader = new FileReader();
  reader.onload = e => {
    json = JSON.parse(e.target.result);
    const endTime = Date.now();
    printResults(`JSON data stored. Took ${endTime - startTime} ms.`);
  };
  const startTime = Date.now();
  reader.readAsBinaryString(file);
}

function _getFile() {
  const fileEl = d.querySelector('#file');
  return fileEl.files[0];
}

function testCompress() {
  const startTime = Date.now();
  jsonCompressed = weissman.compress(json);
  const endTime = Date.now();

  printResults(`Compress took ${endTime - startTime} milliseconds`);
}

function testExpand() {
  const startTime = Date.now();
  weissman.expand(jsonCompressed);
  const endTime = Date.now();

  printResults(`Expand took ${endTime - startTime} milliseconds`);
}

function printResults(resultsStr) {
  d.querySelector('#results').innerHTML = resultsStr;
}
