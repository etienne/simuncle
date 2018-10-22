const config = require('../config');

module.exports = function getGoogleSheetUrl(name) {
  return `https://docs.google.com/spreadsheets/d/${config.googleDocId}/gviz/tq?tqx=out:csv&sheet=${name}`;
};
