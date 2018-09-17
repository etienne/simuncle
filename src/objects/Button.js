import GameObject from './GameObject';

export default class Button extends GameObject {
  constructor(scene, x, y, image, options, callback) {
    super(scene);
    this.image = image;
    this.callback = callback;
    this.button = this.scene.add.image(x, y, 'atlas', image).setInteractive();

    if (options.fadeIn) {
      this.button.alpha = 0;
      this.scene.tweens.add({
        targets: this.button,
        alpha: 1,
        duration: 500,
      });
    }

    if (options.disabled) {
      this.disable();
    } else {
      this.enable();
    }

    const label = options.label ? options.label : scene.l[image];
    this.createFallback('button', label);

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
    if (!this.disabled) {
      this.button.setFrame(this.image);
    }
  }

  mouseover() {
    if (!this.disabled) {
      this.button.setFrame(`${this.image}_hover`);
    }
  }

  active() {
    this.button.setFrame(`${this.image}_active`);
  }

  activate() {
    if (!this.disabled) {
      this.active();
      this.scene.time.delayedCall(20, this.click.bind(this));
    }
  }

  click() {
    this.mouseout();
    this.callback();
  }

  enable() {
    this.disabled = false;
    this.button.setFrame(this.image);
    this.button.alpha = 1;
  }

  disable() {
    this.disabled = true;
    this.button.setFrame(`${this.image}_disabled`);
    this.button.alpha = 0.8;
  }

  remove() {
    this.button.destroy();
    this.removeFallback();
  }
}
