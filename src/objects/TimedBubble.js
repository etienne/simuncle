import TextBubble from './TextBubble';

export default class TimedBubble extends TextBubble {
  constructor(scene, person, text, callback, { idleLine, timeLimit = 18000 }) {
    super(scene, person, text, callback, {});
    this.timeLimit = timeLimit;
    this.idleLine = idleLine;
  }

  animationComplete() {
    // Show ActionBubble
    this.callback();

    // Add timer
    const timerBackground = this.scene.add.graphics()
      .fillStyle(0x262C90)
      .fillRect(this.width + 17, 0, 20, this.height);
    const timer = this.scene.add.graphics()
      .fillStyle(0x3D54ED)
      .fillRect(this.width + 17, 0, 20, this.height);
    const redTimer = this.scene.add.graphics()
      .fillStyle(0xFF5562)
      .fillRect(this.width + 17, 0, 20, this.height)
      .setAlpha(0);
    this.container.add([timerBackground, timer, redTimer]);

    this.tween = this.scene.tweens.add({
      targets: [timer, redTimer],
      props: {
        scaleY: { value: 0, duration: this.timeLimit },
        y: { value: this.height, duration: this.timeLimit },
        alpha: { value: 1, duration: this.timeLimit * 0.05, delay: this.timeLimit * 0.6 },
      },
      onComplete: () => {
        this.remove();
        this.scene.characters.Player.handleIdleResponse(this.idleLine, this.personName);
      },
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
