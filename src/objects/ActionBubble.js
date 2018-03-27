import createElement from '../helpers/createElement';
import { TextBubble } from '.';

export default class ActionBubble extends TextBubble {
  constructor(game, text, parentElement, chooseCallback, dismissCallback) {
    super(game, text, parentElement, chooseCallback);
    const dismissButton = createElement('button', 'dismiss');
    const chooseButton = createElement('button', 'choose');

    if (dismissCallback) {
      dismissButton.onclick = () => {
        window.setTimeout(() => {
          dismissCallback();
        }, 250);
        this.remove();
      }
    } else {
      dismissButton.disabled = true;
    }

    chooseButton.onclick = () => {
      chooseCallback();
      this.remove();
    }

    this.element.appendChild(dismissButton);
    this.element.appendChild(chooseButton);
  }
  
  handleCallback() {
    // Do nothing
  }
}
