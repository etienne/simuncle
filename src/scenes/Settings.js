import Phaser from 'phaser';
import { TabBar } from '../objects';

export default class Settings extends Phaser.Scene {
  constructor() {
    super({ key: 'settings' });
    this.width = 900;
    this.height = 600;
    this.radius = 28;
    this.backgroundColor = 0x262C90;
  }

  create({ l, defaultTextSettings }) {
    this.l = l;
    this.defaultTextSettings = defaultTextSettings;

    this.container = this.add.container(960 - (this.width / 2), 1080 - this.height);
    const background = this.add.graphics()
      .fillStyle(this.backgroundColor)
      .fillRect(0, 0, this.width, this.height)
      .fillRect(this.radius, -this.radius, this.width - (this.radius * 2), this.radius)
      .fillCircle(this.radius, 0, this.radius)
      .fillCircle(this.width - this.radius, 0, this.radius);
    const languageControl = new TabBar(this, l.language, [
      { key: 'french', action: () => { console.log('picked french'); } },
      { key: 'english', action: () => { console.log('picked english'); } },
    ]);
    this.container.add([background, languageControl.container]);
  }
}
