import createElement from '../helpers/createElement';

export default class TextBubble {
  constructor(text, parentElement, callback) {
    this.element = createElement('div', 'TextBubble');
    this.callback = callback;
    
    const textBox = createElement('div', 'text');
    textBox.innerHTML = text;
    this.element.appendChild(textBox);
    parentElement.appendChild(this.element);
    
    this.handleCallback();
  }
  
  handleCallback() {
    window.setTimeout(() => {
      this.callback();
      this.remove();
    }, 3000);
  }
  
  remove() {
    this.element.parentNode.removeChild(this.element);
  }
}
