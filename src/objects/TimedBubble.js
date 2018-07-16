import { TextBubble } from '.';

export default class TimedBubble extends TextBubble {
  constructor(scene, text, slug, x, y, flipped, callback, timeLimit = 18000) {
    super(scene, text, slug, x, y, flipped, callback);
    this.timeLimit = timeLimit;
  }

  animationComplete() {
    // Show ActionBubble
    this.callback();

    // Add timer
    const timerBackground = this.scene.add.graphics().fillStyle(0x262C90).fillRect(this.width + 17, 0, 20, this.height);
    const timer = this.scene.add.graphics().fillStyle(0x3D54ED).fillRect(this.width + 17, 0, 20, this.height);
    const redTimer = this.scene.add.graphics().fillStyle(0xFF5562).fillRect(this.width + 17, 0, 20, this.height).setAlpha(0);
    this.container.add([timerBackground, timer, redTimer]);

    this.tween = this.scene.tweens.add({
      targets: [timer, redTimer],
      props: {
        scaleY: { value: 0, duration: this.timeLimit},
        y: { value: this.height, duration: this.timeLimit},
        alpha: { value: 1, duration: this.timeLimit * 0.05, delay: this.timeLimit * 0.6 },
      },
      onComplete: () => {
        this.scene.characters['Player'].sayNothing();
      }
    });
  }

  handleCallback() {
    this.scene.input.on('pointerdown', this.finishAnimation, this);
  }

  remove() {
    this.tween.stop();
    super.remove();
  }
}
