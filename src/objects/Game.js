import Person from './Person';
import Player from './Player';
import Uncle from './Uncle';
import dialogs from '../dialogs';

export default class Game {
  constructor() {
    this.characters = {
      'Player': new Player(),
      'Uncle': new Uncle(),
      'Cousin 1': new Person('Cousin 1'),
      'Cousin 2': new Person('Cousin 2'),
      'Mom': new Person('Mom'),
      'Bystander 4': new Person('bystander4'),
    };
    this.queue = [];
    
    this.startDialog('intro');
  }
  
  startDialog(name) {
    console.log(dialogs);
    const dialog = dialogs[name];
    
    for (let i = 0; i < dialog.length; i++) {
      const line = dialog[i];
      this.enqueueEvent(() => {
        this.characters[line.person].say(line.text, line.branch, this.advanceQueue.bind(this));
      });
      
      if (line.branch) {
        const branchLines = dialogs[`branch_${line.branch}`];
        const randomLine = branchLines[Math.floor(Math.random()*branchLines.length)];
        console.log(randomLine);
        
        this.enqueueEvent(() => {
          this.characters['Player'].say(randomLine.response, null, this.advanceQueue.bind(this));
        });
        
        if (randomLine.reaction) {
          this.enqueueEvent(() => {
            this.characters['Uncle'].say(randomLine.reaction, null, this.advanceQueue.bind(this));
          });
        }
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
