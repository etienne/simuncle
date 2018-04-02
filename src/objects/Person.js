import createElement from '../helpers/createElement';
import { GameObject, ActionBubble, TextBubble, TimedBubble } from '.';

export default class Person extends GameObject {
  constructor(game, name) {
    super(game);
    const id = name.toLowerCase().split(' ').join('');
    this.element = createElement('div', 'Person', id);
    document.body.appendChild(this.element);
  }
  
  say(text, branch, callback) {
    this.textBubble = branch
      ? new TimedBubble(this.game, text, this.element, callback)
      : new TextBubble(this.game, text, this.element, callback);
  }
  
  choose(branch, callback) {
    const line = branch.shift();
    const uncle = this.game.characters['Uncle'];
    
    const chooseCallback = () => {
      uncle.textBubble.remove();
      if (line.reaction) {
        uncle.say(line.reaction, null, callback);
      } else {
        callback();
      }
    };
    const dismissCallback = branch.length
      ? () => { this.choose(branch, callback); }
      : null;
    
    this.textBubble = new ActionBubble(this.game, line.response, this.element, chooseCallback, dismissCallback);
  }
  
  autoChoose(timedBubble) {
    if (this.textBubble) {
      this.textBubble.element.querySelector('button.choose').click(); // Ugh
    } else {
      console.warn('Attempted to autoChoose but no ActionBubble is present');
    }
  }
}
