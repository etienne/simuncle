import { TextBubble } from '.';

export default class TimedBubble extends TextBubble {
  constructor(scene, text, slug, x, y, flipped, callback, timeLimit = 18000) {
    super(scene, text, slug, x, y, flipped, callback);
    
    // Add timer
    const timerBackground = scene.add.graphics().fillStyle(0x262C90).fillRect(this.width + 17, 0, 20, this.height);
    const timer = scene.add.graphics().fillStyle(0x3D54ED).fillRect(this.width + 17, 0, 20, this.height);
    const redTimer = scene.add.graphics().fillStyle(0xFF5562).fillRect(this.width + 17, 0, 20, this.height).setAlpha(0);
    this.container.add([timerBackground, timer, redTimer]);

    this.tween = scene.tweens.add({
      targets: [timer, redTimer],
      props: {
        scaleY: { value: 0, duration: timeLimit},
        y: { value: this.height, duration: timeLimit},
        alpha: { value: 1, duration: timeLimit * 0.05, delay: timeLimit * 0.6 },
      },
      onComplete: () => {
        this.scene.characters['Player'].autoChoose();
      }
    });
  }
  
  handleCallback() {
    this.callback();
  }
  
  remove() {
    this.tween.stop();
    super.remove();
  }
}
