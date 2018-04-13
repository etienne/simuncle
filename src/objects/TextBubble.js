import createElement from '../helpers/createElement';
import { GameObject } from '.';

export default class TextBubble extends GameObject {
  constructor(game, text, parentElement, callback) {
    super(game);
    this.element = createElement('div', 'TextBubble');
    this.text = text;
    this.callback = callback;
    
    const textBox = createElement('div', 'text');
    textBox.innerHTML = text;
    this.element.appendChild(textBox);
    parentElement.appendChild(this.element);
    
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
