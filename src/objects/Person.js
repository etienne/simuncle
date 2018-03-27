import createElement from '../helpers/createElement';
import { GameObject, TextBubble, TimedBubble } from '.';

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
}
