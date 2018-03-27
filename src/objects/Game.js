import { Person, Player, Uncle } from '.';
import dialogs from '../dialogs';
import shuffle from '../helpers/shuffle';

export default class Game {
  constructor() {
    this.queue = [];
    this.start();
  }
  
  start() {
    this.characters = {
      'Player': new Player(),
      'Uncle': new Uncle(),
      'Cousin 1': new Person('Cousin 1'),
      'Cousin 2': new Person('Cousin 2'),
      'Mom': new Person('Mom'),
      'Bystander 4': new Person('bystander4'),
    };
    this.startDialog('intro');
  }
  
  startDialog(name) {
    const dialog = dialogs[name];
    
    for (let i = 0; i < dialog.length; i++) {
      const line = dialog[i];
      this.enqueueEvent(() => {
        this.characters[line.person].say(line.text, line.branch, this.advanceQueue.bind(this));
      });

      if (line.branch) {
        const branchLines = dialogs[`branch_${line.branch}`];
        shuffle(branchLines);

        this.enqueueEvent(() => {
          this.characters['Player'].choose(branchLines, this.advanceQueue.bind(this), this.characters['Uncle']);
        });
      }
    }
    this.advanceQueue();
  }
  
  enqueueEvent(event, delay) {
    this.queue.push({ event, delay });
  }
  
  advanceQueue() {
    const event = this.queue.shift();
    
    if (event) {
      if (event.delay) {
        window.setTimeout(event.event, event.delay)
      } else {
        event.event();
      }
    }
  }
}
