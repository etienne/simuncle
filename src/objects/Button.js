import GameObject from './GameObject';

export default class Button extends GameObject {
  constructor(scene, x, y, image, fadeIn = false, callback) {
    super(scene);
    this.button = this.scene.add.image(x, y, 'atlas', image).setInteractive();

    if (fadeIn) {
      this.button.alpha = 0;
      this.scene.tweens.add({
        targets: this.button,
        alpha: 1,
        duration: 500,
      });
    }

    this.button.on('focus', () => this.button.setFrame(`${image}_focus`));
    this.button.on('blur', () => this.button.setFrame(image));
    this.button.on('pointerover', () => this.button.setFrame(`${image}_hover`));
    this.button.on('pointerout', () => this.button.setFrame(image));
    this.button.on('pointerdown', () => this.button.setFrame(`${image}_active`));
    this.button.on('pointerup', () => {
      this.button.setFrame(image);
      callback();
    });
  }

  remove() {
    this.button.destroy();
  }
}
