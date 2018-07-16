import Papa from 'papaparse';
import { GameObject } from '.';

export default class GoogleSheetManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.sheetId = '1gQRnrK2_pidsdrJyipDWMRGfZs52Rj2kKx3jy4VBivg';
  }

  parseCSV(csv) {
    return Papa.parse(csv, { header: true }).data;
  }

  getSheetURL(name) {
    return `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv&sheet=${name}`;
  }

  fetchSheet(name, onComplete) {
    Papa.parse(this.getSheetURL(name), {
      download: true,
      header: true,
      complete: results => {
        onComplete(results.data);
      },
    });
  }
}
