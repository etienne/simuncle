import createElement from '../helpers/createElement';
import { GameObject } from '.';

export default class TextBubble extends GameObject {
  constructor(game, text, parentElement, callback) {
    super(game)
    this.element = createElement('div', 'TextBubble');
    this.callback = callback;
    
    const textBox = createElement('div', 'text');
    textBox.innerHTML = text;
    this.element.appendChild(textBox);
    parentElement.appendChild(this.element);
    
    this.handleCallback();
  }
  
  handleCallback() {
    setTimeout(() => {
      this.callback();
      this.remove();
    }, 3000);
  }
  
  remove() {
    this.element.parentNode.removeChild(this.element);
  }
}
