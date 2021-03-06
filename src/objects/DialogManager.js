import { getGoogleSheetUrl, shuffle, locationQuery, parseCSV } from '../helpers';
import GameObject from './GameObject';

export default class DialogManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.dialogs = {};

    // Handle unavailable remote assets
    this.scene.load.on('loaderror', ({ key, type, url }) => {
      if (type === 'text' && url.indexOf('http') !== -1) {
        this.scene.load.text(key, `text/${key}.csv`);
      }
    });
  }

  load(dialog) {
    this.scene.load.text(dialog, getGoogleSheetUrl(dialog));
    this.scene.load.on('load', ({ xhrLoader, type, url, key }) => {
      if (type === 'text' && url.indexOf('sheet=_') === -1) {
        this.add(key, xhrLoader.responseText);
      }
    });
  }

  add(key, response) {
    const dialog = parseCSV(response);
    this.dialogs[key] = dialog;

    dialog.forEach((line) => {
      if (line.branch) {
        this.load(line.branch);
      }
    });
  }

  start(name) {
    const dialog = this.dialogs[name];
    for (let i = 0; i < dialog.length; i += 1) {
      const line = dialog[i];
      let branchLines;
      let idleLine;

      if (line.branch) {
        branchLines = this.dialogs[line.branch];
        idleLine = branchLines.pop();
        shuffle(branchLines);
      }

      this.scene.queue.enqueue(() => {
        this.scene.characters[line.person].say(
          line[this.scene.textField],
          line.branch,
          this.scene.queue.advance.bind(this.scene),
          idleLine,
        );
      });

      if (line.branch) {
        this.scene.queue.enqueue(() => {
          this.scene.characters.Player.choose(
            branchLines,
            line.person,
            this.scene.queue.advance.bind(this.scene),
          );
        });
      }
    }

    if (locationQuery.skip > 0) {
      this.scene.queue.skip(locationQuery.skip);
    }

    this.scene.queue.advance();
  }
}
