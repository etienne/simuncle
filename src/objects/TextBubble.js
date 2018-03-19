import createElement from '../helpers/createElement';

export default class TextBubble {
  constructor(text, parentElement, options = {}) {
    this.element = createElement('div', 'TextBubble');
    
    // Add text box
    const textBox = createElement('div', 'text');
    textBox.innerHTML = text;
    this.element.appendChild(textBox);
    
    // Append to parent element
    parentElement.appendChild(this.element);
    
    // Show timer
    if (options.timeLimit) {
      const timer = createElement('div', 'timer');
      this.element.appendChild(timer);
      window.setTimeout(() => { timer.classList.toggle('active'); }, 0);
    }
      
    // Run callback
    const callback = () => {
      if (options.callback) {
        options.callback();
      }
      this.element.parentNode.removeChild(this.element);
    };
    window.setTimeout(callback, options.timeLimit || 3000);
  }  
}
