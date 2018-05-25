import createElement from '../helpers/createElement';
import { GameObject } from '.';

export default class TextBubble extends GameObject {
  constructor(scene, text, slug, x, y, flipped, callback) {
    super(scene);
    this.width = 780;
    this.height = 260;
    this.text = text;
    this.callback = callback;

    this.container = scene.add.container(x - this.width / 2, y + (this.height * (flipped ? 1 : -1)));
    const background = scene.add.graphics().fillStyle(0x3240BF).fillRect(0, 0, this.width, this.height);
    this.face = scene.add.image(0, this.height, slug).setOrigin(0, 1);
    const triangle = scene.add.image(this.width / 2, flipped ? 0 : this.height, 'triangle').setOrigin(0, 0).setAngle(flipped ? 180 : 0);
    const textObject = scene.add.text(320, 36, this.text, {
      fontFamily: 'Nunito Sans',
      fontSize: 27,
      color: '#E0ECDF',
      wordWrap: { width: 420 },
      baselineX: 10,
      lineSpacing: 6,
    });
    this.container.add([background, this.face, triangle, textObject]);
    this.handleCallback();
  }
  
  clickCallback() {
    this.remove();
    this.callback();
  }
  
  handleCallback() {
    this.scene.input.on('pointerdown', this.clickCallback, this);
  }
  
  remove() {
    this.scene.input.off('pointerdown', this.clickCallback, this);
    this.container.destroy();
  }
}
