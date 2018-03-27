import { TextBubble } from '.';
import createElement from '../helpers/createElement';

export default class TimedBubble extends TextBubble {
  constructor(text, parentElement, callback, timeLimit = 8000) {
    super(text, parentElement, callback);
    
    // Add timer
    const timer = createElement('div', 'timer');
    this.element.appendChild(timer);
    window.setTimeout(() => { timer.classList.toggle('active'); }, 0);
    
    // Automatically remove bubble once the timer is up
    // window.setTimeout(() => {
    //   this.callback();
    //   this.remove();
    // }, timeLimit);
  }
  
  handleCallback() {
    this.callback();
  }
}
