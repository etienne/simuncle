import { TextBubble } from '.';

export default class ActionBubble extends TextBubble {
  constructor(scene, text, slug, x, y, flipped, chooseCallback, dismissCallback) {
    super(scene, text, slug, x, y, flipped, chooseCallback);
    
    const backgroundHeight = 17 + 60 + 17;
    const buttonsBackground = scene.add.graphics().fillStyle(0x2C36A8).fillRect(0, this.height - backgroundHeight, this.width, backgroundHeight);
    const chooseButton = scene.add.image(this.width - 17 - 144 - 17, this.height - 17, 'chooseButton').setOrigin(1, 1).setInteractive();
    const dismissButton = scene.add.image(this.width - 17, this.height - 17, 'dismissButton').setOrigin(1, 1).setInteractive();
    this.container.add([buttonsBackground, chooseButton, dismissButton]);
    this.container.bringToTop(this.face);

    if (dismissCallback) {
      dismissButton.on('pointerdown', () => {
        setTimeout(() => {
          dismissCallback();
        }, 250);
        this.remove();
      });
    } else {
      dismissButton.setAlpha(0.4);
    }

    chooseButton.on('pointerdown', () => {
      chooseCallback();
      this.remove();
    });
  }
  
  handleCallback() {
    // Do nothing
  }
}
