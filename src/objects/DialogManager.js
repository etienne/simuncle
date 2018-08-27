import { shuffle, locationQuery } from '../helpers';
import GameObject from './GameObject';

export default class DialogManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.dialogs = {};
  }

  load(entryPoint) {
    this.scene.googleSheets.fetchSheet(entryPoint, (dialog) => {
      this.dialogs[entryPoint] = dialog;

      dialog.forEach((line) => {
        if (line.branch) {
          this.scene.googleSheets.fetchSheet(line.branch, (branch) => {
            this.dialogs[line.branch] = branch;
          });
        }
      });
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
