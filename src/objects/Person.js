import createElement from '../helpers/createElement';
import { GameObject, TextBubble } from '.';

export default class Person extends GameObject {
  constructor(scene, name, x, y) {
    super(scene);
    this.name = name;
    this.x = x;
    this.y = y;
  }
  
  say(text, branch, callback) {
    this.textBubble = branch
      ? new TimedBubble(this.scene, text, this.x, this.y, callback)
      : new TextBubble(this.scene, text, this.x, this.y, callback);
  }
  
  choose(branch, callback) {
    const line = branch.shift();
    const uncle = this.game.characters['Uncle'];

    const chooseCallback = () => {
      uncle.textBubble.remove();
      if (line.reaction && line.reaction !== ' ') {
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
