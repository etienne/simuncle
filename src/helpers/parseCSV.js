import Papa from 'papaparse';

export default function parseCSV(csv) {
  return Papa.parse(csv, { header: true }).data;
}
