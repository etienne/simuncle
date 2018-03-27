import { ActionBubble, Person } from '.';

export default class Player extends Person {
  constructor(game) {
    super(game, 'Player');
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
  
  autoChoose() {
    if (this.textBubble) {
      this.textBubble.element.querySelector('button.choose').click(); // Ugh
    } else {
      console.warn('Attempted to autoChoose but no ActionBubble is present');
    }
  }
}
