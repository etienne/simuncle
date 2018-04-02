import { TextBubble } from '.';
import createElement from '../helpers/createElement';

export default class TimedBubble extends TextBubble {
  constructor(game, text, parentElement, callback, timeLimit = 8000) {
    super(game, text, parentElement, callback);
    
    // Add timer
    const timer = createElement('div', 'timer');
    this.element.appendChild(timer);
    setTimeout(() => { timer.classList.toggle('active'); }, 0);
    
    // Automatically remove bubble once the timer is up
    this.timeout = setTimeout(() => {
      this.game.characters['Player'].autoChoose();
    }, timeLimit);
  }
  
  handleCallback() {
    this.callback();
  }
  
  remove() {
    super.remove();
    clearTimeout(this.timeout);
  }
}
