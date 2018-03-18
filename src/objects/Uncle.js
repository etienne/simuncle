import Person from './Person';
import TextBubble from './TextBubble';

export default class Uncle extends Person {
  constructor() {
    super('uncle');
    this.say('some racist shit');
  }
  
  say(text) {
    const callback = () => {
      console.log('callback!!!1');
    }
    const textBubble = new TextBubble(text, this.element, { timeLimit: 8000, callback: callback });
  }
}
