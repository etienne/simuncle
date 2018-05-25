import 'phaser';
import Papa from 'papaparse';
import { Person } from '../objects';
import dialogs from '../dialogs';
import background from '../assets/background.png';
import cousin1 from '../assets/cousin1.png';
import cousin2 from '../assets/cousin2.png';
import mom from '../assets/mom.png';
import player from '../assets/player.png';
import table from '../assets/table.png';
import triangle from '../assets/triangle.png';
import uncle from '../assets/uncle.png';
import shuffle from '../helpers/shuffle';

export default class Main extends Phaser.Scene {
  preload() {
    this.queue = [];
    this.load.image('background', background);
    this.load.image('cousin1', cousin1);
    this.load.image('cousin2', cousin2);
    this.load.image('mom', mom);
    this.load.image('player', player);
    this.load.image('table', table);
    this.load.image('triangle', triangle);
    this.load.image('uncle', uncle);
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const table = this.add.image(960, 540, 'table');
    background.setOrigin(0);
    
    this.characters = {
      'Player':    new Person(this, 'Player',    900,  500),
      'Uncle':     new Person(this, 'Uncle',     1020, 280),
      'Cousin 1':  new Person(this, 'Cousin 1',  855,  280),
      'Cousin 2':  new Person(this, 'Cousin 2',  1195, 280),
      'Mom':       new Person(this, 'Mom',       735,  500),
      'Bystander': new Person(this, 'Bystander', 1065, 500),
    };
    this.startDialog('intro');
  }
  
  startDialog(name) {
    const docId = '1gQRnrK2_pidsdrJyipDWMRGfZs52Rj2kKx3jy4VBivg';
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
