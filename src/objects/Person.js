import createElement from '../helpers/createElement';
import TextBubble from './TextBubble';

export default class Person {
  constructor(name) {
    this.element = createElement('div', 'Person', name);
    document.body.appendChild(this.element);
  }
  
  say(text) {
    const textBubble = new TextBubble(text, this.element);
  }
}
