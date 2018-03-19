import createElement from '../helpers/createElement';
import TextBubble from './TextBubble';

export default class Person {
  constructor(name) {
    const id = name.toLowerCase().split(' ').join('');
    this.element = createElement('div', 'Person', id);
    document.body.appendChild(this.element);
  }
  
  say(text, branch, callback) {
    const options = {
      callback,
    };
    
    if (branch) {
      options.timeLimit = 3000;
    }
    
    this.textBubble = new TextBubble(text, this.element, options);
  }
}
