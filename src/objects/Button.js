import GameObject from './GameObject';

export default class Button extends GameObject {
  constructor(scene, x, y, image, label, options, callback) {
    super(scene);
    this.image = image;
    this.callback = callback;
    this.button = this.scene.add.image(x, y, 'atlas', image).setInteractive();
    this.createFallback('button', label);

    if (options.fadeIn) {
      this.button.alpha = 0;
      this.scene.tweens.add({
        targets: this.button,
        alpha: 1,
        duration: 500,
      });
    }

    this.button.on('focus', this.focus.bind(this));
    this.button.on('blur', this.blur.bind(this));
    this.button.on('pointerover', this.mouseover.bind(this));
    this.button.on('pointerout', this.mouseout.bind(this));
    this.button.on('pointerdown', this.active.bind(this));
    this.button.on('pointerup', this.click.bind(this));

    this.fallback.onfocus = this.focus.bind(this);
    this.fallback.onblur = this.blur.bind(this);
    this.fallback.onclick = this.activate.bind(this);
  }

  focus() {
    this.button.setFrame(`${this.image}_focus`);
  }

  blur() {
    this.mouseout();
  }

  mouseout() {
    this.button.setFrame(this.image);
  }

  mouseover() {
    this.button.setFrame(`${this.image}_hover`);
  }

  active() {
    this.button.setFrame(`${this.image}_active`);
  }

  activate() {
    this.active();
    this.scene.time.delayedCall(20, this.click.bind(this));
  }

  click() {
    this.mouseout();
    this.callback();
  }

  remove() {
    this.button.destroy();
    this.removeFallback();
  }
}
