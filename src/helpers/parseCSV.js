const Papa = require('papaparse');

module.exports = function parseCSV(csv) {
  return Papa.parse(csv, { header: true }).data;
};
