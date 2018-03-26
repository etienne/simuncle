import Person from './Person';
import ActionBubble from './ActionBubble';

export default class Player extends Person {
  constructor() {
    super('Player');
  }
  
  choose(branch, callback, uncle) {
    const line = branch.shift();
    const chooseCallback = () => {
      uncle.textBubble.remove();
      if (line.reaction) {
        uncle.say(line.reaction, null, callback);
      } else {
        callback();
      }
    };
    const dismissCallback = branch.length
      ? () => { this.choose(branch, callback, uncle); }
      : null;
    
    this.textBubble = new ActionBubble(line.response, this.element, chooseCallback, dismissCallback);
  }
}
