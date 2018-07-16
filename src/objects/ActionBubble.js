import { TextBubble } from '.';

export default class ActionBubble extends TextBubble {
  constructor(scene, text, slug, x, y, flipped, chooseCallback, dismissCallback) {
    super(scene, text, slug, x, y, flipped, chooseCallback, 17 + 60 + 17);
    
    const backgroundHeight = 17 + 60 + 17;
    const buttonsBackground = scene.add.graphics().fillStyle(0x2C36A8).fillRect(0, this.height - backgroundHeight, this.width, backgroundHeight);
    this.chooseButton = scene.add.image(this.width - 17, this.height - 17, 'atlas', 'chooseButton').setOrigin(1, 1).setInteractive();
    this.dismissButton = scene.add.image(this.width - 17 - 144 - 17, this.height - 17, 'atlas', 'dismissButton').setOrigin(1, 1).setInteractive();
    this.container.add([buttonsBackground, this.chooseButton, this.dismissButton]);
    this.container.bringToTop(this.face);
    this.chooseCallback = chooseCallback;

    if (dismissCallback) {
      this.dismissButton.on('pointerdown', () => {
        setTimeout(() => {
          dismissCallback();
        }, 250);
        this.remove();
      });
    } else {
      this.dismissButton.setAlpha(0.25);
    }

    this.chooseButton.on('pointerdown', this.choose, this);
  }
  
  choose() {
    this.chooseCallback();
    this.remove();
  }
  
  handleCallback() {
    this.scene.input.on('pointerdown', this.finishAnimation, this);
  }

  remove() {
    this.scene.input.off('pointerdown', this.finishAnimation, this);
    this.container.destroy();
  }
}
