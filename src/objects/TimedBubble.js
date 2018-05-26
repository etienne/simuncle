import { TextBubble } from '.';

export default class TimedBubble extends TextBubble {
  constructor(scene, text, slug, x, y, flipped, callback, timeLimit = 12000) {
    super(scene, text, slug, x, y, flipped, callback);
    
    // Add timer
    const timerBackground = scene.add.graphics().fillStyle(0x262C90).fillRect(this.width + 17, 0, 20, this.height);
    const timer = scene.add.graphics().fillStyle(0x3D54ED).fillRect(this.width + 17, 0, 20, this.height);
    // const purpleTimer = scene.add.graphics().fillStyle(0x8D3662).fillRect(this.width, 0, 20, this.height).setAlpha(0);
    // const redTimer = scene.add.graphics().fillStyle(0xFF5562).fillRect(this.width, 0, 20, this.height).setAlpha(0);
    this.container.add([timerBackground, timer]);

    this.tween = scene.tweens.add({
      targets: [timer],
      scaleY: 0,
      y: this.height,
      // alpha: 1,
      duration: timeLimit,
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
