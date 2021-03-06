import GameObject from './GameObject';

export default class TextBubble extends GameObject {
  constructor(scene, { flipped, x, y, slug, name }, string, callback, {
    heightAdjustment = 0,
    isFirst,
  }) {
    super(scene);
    this.string = string;
    this.callback = callback;
    this.flipped = flipped;
    this.personName = name;
    this.isFirst = isFirst;

    this.width = Math.min(900, Math.round(string.length * 2.5) + 400);
    const textWidth = this.width - 230;
    this.text = scene.add.text(190, 42, this.string, {
      ...scene.defaultTextSettings,
      wordWrap: { width: textWidth },
    });
    this.height = this.text.height + 42 + 42 + heightAdjustment;
    this.textWithLineBreaks = this.text.runWordWrap(this.text.text);
    this.text.setWordWrapWidth(null);

    this.container = scene.add.container(
      x - this.width / 2,
      flipped ? y + 180 : y - this.height - 20,
    );
    this.background = scene.add.graphics()
      .fillStyle(0x2C36A8)
      .fillRect(0, 0, this.width, this.height);
    this.face = scene.add.image(0, this.height / 2, 'atlas', slug);
    this.triangle = scene.add.image(this.width / 2, flipped ? 0 : this.height, 'atlas', 'triangle')
      .setOrigin(0, 0)
      .setAngle(flipped ? 180 : 0);
    this.container.add([this.background, this.face, this.triangle, this.text]);

    this.animating = true;
    this.skipAnimation = false;
    this.animate();

    // Accessibility
    const verb = this.personName === 'Player' ? this.scene.l.say : this.scene.l.says;
    this.scene.updateStatus(`${this.scene.l[this.personName]} ${verb}: ${string}`);
  }

  animate() {
    const characterCount = this.textWithLineBreaks.length;
    const characterDelay = 12;
    let currentText = '';
    for (let index = 0; index < characterCount; index += 1) {
      currentText += this.textWithLineBreaks[index];
      this.scene.time.delayedCall(characterDelay * index, (text) => {
        if (!this.skipAnimation && !!this.text.scene) {
          this.text.setText(text);
        }
      }, [currentText], this);
    }
    this.scene.time.delayedCall(characterDelay * characterCount, this.finishAnimation, [], this);

    this.container.alpha = 0;
    const animationOffset = 30;
    this.container.y = this.container.y + ((this.flipped ? 1 : -1) * animationOffset);
    this.scene.tweens.add({
      targets: [this.container],
      alpha: 1,
      y: `${this.flipped ? '-' : '+'}=${animationOffset}`,
      duration: 400,
      ease: 'Power2',
      onComplete: this.handleCallback.bind(this),
    });
  }

  finishAnimation() {
    if (this.animating) {
      this.skipAnimation = true;
      this.animating = false;
      if (this.text.scene) {
        this.text.setText(this.textWithLineBreaks);
      }
      if (this.animationComplete) {
        this.animationComplete();
      }
    }
  }

  clickCallback() {
    if (this.animating) {
      this.finishAnimation();
    } else {
      this.remove();
      this.callback();
    }
  }

  handleCallback() {
    this.scene.input.on('pointerdown', this.clickCallback, this);
  }

  remove() {
    this.scene.input.off('pointerdown', this.clickCallback, this);
    this.container.destroy();
  }
}
