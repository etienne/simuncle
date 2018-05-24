import Papa from 'papaparse';
import { Person } from '.';
import dialogs from '../dialogs';
import createElement from '../helpers/createElement';
import shuffle from '../helpers/shuffle';

export default class Game {
  constructor() {
    this.queue = [];
    this.start();
  }
  
  start() {
    this.stage = createElement('div', 'Stage');
    document.body.appendChild(this.stage);
    this.characters = {
      'Narrator': new Person(this, 'Narrator'),
      'Player': new Person(this, 'Player'),
      'Uncle': new Person(this, 'Uncle'),
      'Cousin 1': new Person(this,'Cousin 1'),
      'Cousin 2': new Person(this, 'Cousin 2'),
      'Mom': new Person(this, 'Mom'),
      'Bystander': new Person(this, 'Bystander'),
    };
    this.startDialog('intro');
  }
  
  startDialog(name) {
    const docId = '1HrCBRWumu9cVI1VIMZqhBl783VRE5bOK9RIl9h6_xcQ';
    Papa.parse(`https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&sheet=${name}`, {
      download: true,
      header: true,
      complete: results => {
        // console.log(results);
        
        // const dialog = dialogs[name];
        const dialog = results.data;
    
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
    });
  }
  
  enqueueEvent(event, delay) {
    this.queue.push({ event, delay });
  }
  
  advanceQueue() {
    const event = this.queue.shift();
    
    if (event) {
      if (event.delay) {
        setTimeout(event.event, event.delay)
      } else {
        event.event();
      }
    }
  }
}
