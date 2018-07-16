import { GameObject } from '.';

export default class TextBubble extends GameObject {
  constructor(scene, string, slug, x, y, flipped, callback, heightAdjustment = 0) {
    super(scene);
    this.string = string;
    this.callback = callback;
    this.flipped = flipped;
    
    this.width = Math.min(900, Math.round(string.length * 1.5) + 600);
    const textWidth = this.width - 360;
    this.text = scene.add.text(320, 36, this.string, {
      ...scene.defaultTextSettings,
      wordWrap: { width: textWidth },
    });
    this.height = Math.max(260, this.text.height + 36 + 36 + heightAdjustment);
    this.textWithLineBreaks = this.text.runWordWrap(this.text.text);
    this.text.setWordWrapWidth(null);

    this.container = scene.add.container(x - this.width / 2, flipped ? y + 160 : y - this.height);
    this.background = scene.add.graphics().fillStyle(0x3240BF).fillRect(0, 0, this.width, this.height);
    this.face = scene.add.image(0, this.height, 'atlas', slug).setOrigin(0, 1);
    this.triangle = scene.add.image(this.width / 2, flipped ? 0 : this.height, 'atlas', 'triangle').setOrigin(0, 0).setAngle(flipped ? 180 : 0);
    this.container.add([this.background, this.face, this.triangle, this.text]);
    this.animate();
  }
  
  animate() {
    let currentText = '';
    for (let index = 0; index < this.textWithLineBreaks.length; index++) {
      currentText += this.textWithLineBreaks[index];
      this.scene.time.delayedCall(16 * index, text => {
        this.text.setText(text);
      }, [currentText], this);
    }

    this.container.alpha = 0;
    const animationOffset = 30;
    this.container.y = this.container.y + ((this.flipped ? 1 : -1) * animationOffset);
    this.scene.tweens.add({
      targets: [this.container],
      alpha: 1,
      y: `${this.flipped ? '-' : '+'}=${animationOffset}`,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: this.handleCallback.bind(this),
    });
  }
  
  clickCallback() {
    this.remove();
    this.callback();
  }
  
  handleCallback() {
    this.scene.input.on('pointerdown', this.clickCallback, this);
  }
  
  remove() {
    this.scene.input.off('pointerdown', this.clickCallback, this);
    this.container.destroy();
  }
}
