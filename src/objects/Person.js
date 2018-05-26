import createElement from '../helpers/createElement';
import { ActionBubble, GameObject, TextBubble, TimedBubble } from '.';

export default class Person extends GameObject {
  constructor(scene, name, x, y, flipped = false) {
    super(scene);
    this.name = name;
    this.slug = name.split(' ').join('').toLowerCase();
    this.x = x;
    this.y = y;
    this.flipped = flipped;
  }
  
  say(text, branch, callback) {
    this.textBubble = branch
      ? new TimedBubble(this.scene, text, this.slug, this.x, this.y, this.flipped, callback)
      : new TextBubble(this.scene, text, this.slug, this.x, this.y, this.flipped, callback);
  }
  
  choose(branch, callback) {
    const line = branch.shift();
    const uncle = this.scene.characters['Uncle'];

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

    this.textBubble = new ActionBubble(this.scene, line.response, this.slug, this.x, this.y, this.flipped, chooseCallback, dismissCallback);
  }
  
  autoChoose(timedBubble) {
    if (this.textBubble) {
      this.textBubble.choose();
    } else {
      console.warn('Attempted to autoChoose but no ActionBubble is present');
    }
  }
}
