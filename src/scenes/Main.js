import 'phaser';
import { Person } from '../objects';
import background from '../assets/background.png';
import table from '../assets/table.png';
import triangle from '../assets/triangle.png';

export default class Main extends Phaser.Scene {
  preload() {
    this.queue = [];
    this.load.image('background', background);
    this.load.image('table', table);
    this.load.image('triangle', triangle);
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const table = this.add.image(960, 540, 'table');
    background.setOrigin(0);
    
    this.characters = {
      // 'Narrator':  new Person(this, 'Narrator',  100, 200),
      'Player':    new Person(this, 'Player',    100, 200),
      'Uncle':     new Person(this, 'Uncle',     100, 200),
      'Cousin 1':  new Person(this, 'Cousin 1',  100, 200),
      'Cousin 2':  new Person(this, 'Cousin 2',  100, 200),
      'Mom':       new Person(this, 'Mom',       100, 200),
      'Bystander': new Person(this, 'Bystander', 100, 200),
    };
  }
}
