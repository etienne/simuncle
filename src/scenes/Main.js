import 'phaser';
import Papa from 'papaparse';
import { Person } from '../objects';
import shuffle from '../helpers/shuffle';

export default class Main extends Phaser.Scene {
  preload() {
    this.queue = [];
    this.dialogs = {};
    this.load.atlas('atlas', 'atlas.png', 'atlas.json');
    this.loadDialogs('intro');
    this.peace = 100;
  }

  create() {
    const background = this.add.image(0, 0, 'atlas', 'background');
    const table = this.add.image(960, 600, 'atlas', 'table');
    const title = this.add.image(960, 200, 'atlas', 'title').setAlpha(0);
    const start = this.add.image(960, 925, 'atlas', 'start').setAlpha(0).setInteractive();
    background.setOrigin(0);
    
    this.characters = {
      'Cousin 1':  new Person(this, 'Cousin 1',  855,  340),
      'Uncle':     new Person(this, 'Uncle',     1025, 340),
      'Cousin 2':  new Person(this, 'Cousin 2',  1195, 340),
      'Mom':       new Person(this, 'Mom',       735,  490, true),
      'Player':    new Person(this, 'Player',    905,  490, true),
      'Bystander': new Person(this, 'Bystander', 1075, 490, true),
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
  
  loadDialogs(entryPoint) {
    this.fetchDialog(entryPoint, dialog => {
      this.dialogs[entryPoint] = dialog;
      
      dialog.map(line => {
        if (line.branch) {
          this.fetchDialog(line.branch, branch => {
            this.dialogs[line.branch] = branch;
          });
        }
      });
    });
  }
  
  startDialog(name) {
    const dialog = this.dialogs[name];
    for (let i = 0; i < dialog.length; i++) {
      const line = dialog[i];
      this.enqueueEvent(() => {
        this.characters[line.person].say(line.text, line.branch, this.advanceQueue.bind(this));
      });

      if (line.branch) {
        const branchLines = this.dialogs[line.branch];
        shuffle(branchLines);

        this.enqueueEvent(() => {
          this.characters['Player'].choose(branchLines, this.advanceQueue.bind(this), this.characters['Uncle']);
        });
      }
    }
    this.advanceQueue();
  }
  
  fetchDialog(name, callback) {
    const docId = '1gQRnrK2_pidsdrJyipDWMRGfZs52Rj2kKx3jy4VBivg';
    Papa.parse(`https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&sheet=${name}`, {
      download: true,
      header: true,
      complete: results => {
        callback(results.data);
      },
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
  
  damagePeace(peace) {
    this.peace -= peace;
  }
}
