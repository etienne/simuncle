import 'phaser';
import Papa from 'papaparse';
import { Person } from '../objects';
import dialogs from '../dialogs';
import title from '../assets/images/title.png';
import start from '../assets/images/start.png';
import background from '../assets/images/background.png';
import cousin1 from '../assets/images/cousin1.png';
import cousin2 from '../assets/images/cousin2.png';
import mom from '../assets/images/mom.png';
import player from '../assets/images/player.png';
import table from '../assets/images/table.png';
import triangle from '../assets/images/triangle.png';
import uncle from '../assets/images/uncle.png';
import chooseButton from '../assets/images/chooseButton.png';
import dismissButton from '../assets/images/dismissButton.png';
import shuffle from '../helpers/shuffle';

export default class Main extends Phaser.Scene {
  preload() {
    this.queue = [];
    this.load.image('title', title);
    this.load.image('start', start);
    this.load.image('background', background);
    this.load.image('cousin1', cousin1);
    this.load.image('cousin2', cousin2);
    this.load.image('mom', mom);
    this.load.image('player', player);
    this.load.image('table', table);
    this.load.image('triangle', triangle);
    this.load.image('uncle', uncle);
    this.load.image('chooseButton', chooseButton);
    this.load.image('dismissButton', dismissButton);
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const table = this.add.image(960, 600, 'table');
    const title = this.add.image(960, 200, 'title').setAlpha(0);
    const start = this.add.image(960, 925, 'start').setAlpha(0).setInteractive();
    background.setOrigin(0);
    
    this.characters = {
      'Cousin 1':  new Person(this, 'Cousin 1',  855,  340),
      'Uncle':     new Person(this, 'Uncle',     1020, 340),
      'Cousin 2':  new Person(this, 'Cousin 2',  1195, 340),
      'Mom':       new Person(this, 'Mom',       735,  560, true),
      'Player':    new Person(this, 'Player',    900,  560, true),
      'Bystander': new Person(this, 'Bystander', 1065, 560, true),
    };
    
    const tween = this.tweens.add({
      targets: [title, start],
      alpha: 1,
      duration: 500,
    });
    
    start.on('pointerdown', () => {
      this.tweens.add({
        targets: [title, start],
        alpha: 0,
        duration: 500,
        onComplete: () => { this.startDialog('intro'); },
      });
    });
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
    } else {
      this.scene.restart();
    }
  }
}
