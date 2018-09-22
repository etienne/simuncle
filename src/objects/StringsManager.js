import Papa from 'papaparse';
import GameObject from './GameObject';
import localStrings from '../strings';

export default class StringsManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.sheetId = '1gQRnrK2_pidsdrJyipDWMRGfZs52Rj2kKx3jy4VBivg';
  }

  static parseCSV(csv) {
    return Papa.parse(csv, { header: true }).data;
  }

  getSheetURL(name) {
    return `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv&sheet=${name}`;
  }

  fetchSheet(name, onComplete) {
    Papa.parse(this.getSheetURL(name), {
      download: true,
      header: true,
      complete: results => onComplete(results.data),
      error: () => {
        console.warn(`Dialog "${name}" could not be loaded remotely; attempting to load locally`);
        if (localStrings[name]) {
          onComplete(localStrings[name])
        } else {
          console.error(`Dialog "${name}" could not be loaded locally either`);
        }
      },
    });
  }
}
