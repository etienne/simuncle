import createElement from '../helpers/createElement';
import { GameObject } from '.';

export default class TextBubble extends GameObject {
  constructor(scene, text, x, y, callback) {
    super(scene);
    const width = 780;
    const height = 260;
    this.text = text;
    this.callback = callback;

    this.container = scene.add.container(x - width / 2, y - height);
    const graphics = scene.add.graphics().fillStyle(0x3240BF).fillRect(0, 0, width, height);
    const face = scene.add.image(0, height, 'uncle').setOrigin(0, 1);
    const triangle = scene.add.image(width / 2, height, 'triangle').setOrigin(0, 0);
    const textObject = scene.add.text(310, 20, this.text, { fontFamily: 'Arial', fontSize: 27, color: '#E0ECDF' });
    this.container.add(graphics);
    this.container.add(face);
    this.container.add(triangle);
    this.container.add(textObject);
    
    this.boundClickCallback = this.clickCallback.bind(this);
    this.handleCallback();
  }
  
  clickCallback() {
    this.remove();
    this.callback();
  }
  
  handleCallback() {
    this.game.stage.addEventListener('mousedown', this.boundClickCallback);
    this.game.stage.classList.add('clickable');
  }
  
  remove() {
    this.element.parentNode.removeChild(this.element);
    this.game.stage.removeEventListener('mousedown', this.boundClickCallback);
    this.game.stage.classList.remove('clickable');
  }
}
