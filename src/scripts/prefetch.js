const https = require('https');
const fs = require('fs');
const config = require('../config');
const getGoogleSheetUrl = require('../helpers/getGoogleSheetUrl');
const parseCSV = require('../helpers/parseCSV');

function fetchAndWriteCsv(name) {
  const filename = `assets/text/${name}.csv`;
  const url = getGoogleSheetUrl(name);
  const file = fs.createWriteStream(filename);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log(`Saved file ${filename}`);
        const data = parseCSV(fs.readFileSync(filename, 'utf8'));
        data.forEach((line) => {
          if (line.branch) {
            fetchAndWriteCsv(line.branch);
          }
        });
      });
    });
  }).on('error', (err) => {
    fs.unlink(filename);
    console.error(err.message);
  });
}

fetchAndWriteCsv(config.dialogEntryPoint);
fetchAndWriteCsv('_strings');
