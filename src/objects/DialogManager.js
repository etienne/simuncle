import { shuffle, locationQuery } from '../helpers';
import { GameObject } from '.';

export default class DialogManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.dialogs = {};
  }
  
  load(entryPoint) {
    this.scene.googleSheets.fetchSheet(entryPoint, dialog => {
      this.dialogs[entryPoint] = dialog;
      
      dialog.map(line => {
        if (line.branch) {
          this.scene.googleSheets.fetchSheet(line.branch, branch => {
            this.dialogs[line.branch] = branch;
          });
        }
      });
    });
  }
  
  start(name) {
    const dialog = this.dialogs[name];
    for (let i = 0; i < dialog.length; i++) {
      const line = dialog[i];
      
      this.scene.queue.enqueue(() => {
        this.scene.characters[line.person].say(line[this.scene.textField], line.branch, this.scene.queue.advance.bind(this.scene));
      });

      if (line.branch) {
        const branchLines = this.dialogs[line.branch];
        shuffle(branchLines);

        this.scene.queue.enqueue(() => {
          this.scene.characters['Player'].choose(branchLines, this.scene.queue.advance.bind(this.scene));
        });
      }
    }
    
    if (locationQuery.skip > 0) {
      this.scene.queue.skip(locationQuery.skip);
    }
    
    this.scene.queue.advance();
  }
}
  