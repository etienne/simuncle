import createElement from '../helpers/createElement';
import { GameObject } from '.';

export default class Person extends GameObject {
  constructor(scene, name, x, y) {
    super(scene);
    this.name = name;
    const roger = scene.add.image(x, y, 'triangle');
  }
  
  say(text, branch, callback) {
    // this.textBubble = branch
    //   ? new TimedBubble(this.game, text, this.element, callback)
    //   : new TextBubble(this.game, text, this.element, callback);
  }
  
  choose(branch, callback) {
    // const line = branch.shift();
    // const uncle = this.game.characters['Uncle'];
    //
    // const chooseCallback = () => {
    //   uncle.textBubble.remove();
    //   if (line.reaction && line.reaction !== ' ') {
    //     uncle.say(line.reaction, null, callback);
    //   } else {
    //     callback();
    //   }
    // };
    // const dismissCallback = branch.length
    //   ? () => { this.choose(branch, callback); }
    //   : null;
    //
    // this.textBubble = new ActionBubble(this.game, line.response, this.element, chooseCallback, dismissCallback);
  }
  
  autoChoose(timedBubble) {
    // if (this.textBubble) {
    //   this.textBubble.element.querySelector('button.choose').click(); // Ugh
    // } else {
    //   console.warn('Attempted to autoChoose but no ActionBubble is present');
    // }
  }
}
