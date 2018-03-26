import createElement from '../helpers/createElement';
import TextBubble from './TextBubble';
import TimedBubble from './TimedBubble';

export default class Person {
  constructor(name) {
    const id = name.toLowerCase().split(' ').join('');
    this.element = createElement('div', 'Person', id);
    document.body.appendChild(this.element);
  }
  
  say(text, branch, callback) {
    this.textBubble = branch
      ? new TimedBubble(text, this.element, callback)
      : new TextBubble(text, this.element, callback);
  }
}
