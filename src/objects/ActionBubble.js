import TextBubble from './TextBubble';
import Button from './Button';

export default class ActionBubble extends TextBubble {
  constructor(scene, person, text, chooseCallback, dismissCallback, { isFirst }) {
    super(scene, person, text, chooseCallback, { heightAdjustment: 25, isFirst });
    this.chooseCallback = chooseCallback;

    this.dismissButton = new Button(scene, this.width - 45 - 25 - 90 - 25, this.height, 'dismiss', { disabled: !dismissCallback }, () => {
      scene.time.delayedCall(250, dismissCallback.bind(this));
      this.remove();
    });
    this.chooseButton = new Button(scene, this.width - 45 - 25, this.height, 'choose', {}, this.choose.bind(this));
    this.container.add([this.chooseButton.button, this.dismissButton.button]);
  }

  choose() {
    this.chooseCallback();
    this.remove(true);
  }

  handleCallback() {
    this.scene.input.on('pointerdown', this.finishAnimation, this);
  }

  animate() {
    if (this.isFirst) {
      super.animate();
      this.finishAnimation();
    } else {
      const animationOffset = 100;
      this.animating = true;
      this.finishAnimation();
      this.container.x = this.container.x + animationOffset;
      this.scene.tweens.add({
        targets: [this.container],
        alpha: 1,
        x: `-=${animationOffset}`,
        duration: 400,
        ease: 'Power2',
        onComplete: this.handleCallback.bind(this),
      });
    }
  }

  remove(choose) {
    this.scene.input.off('pointerdown', this.finishAnimation, this);

    if (choose) {
      this.scene.tweens.add({
        targets: [this.container],
        alpha: 0,
        y: '+=30',
        duration: 150,
        ease: 'Cubic.In',
        onComplete: this.container.destroy,
      });
    } else {
      const animationOffset = 80;
      this.scene.tweens.add({
        targets: [this.container],
        alpha: 0,
        x: `-=${animationOffset}`,
        duration: 150,
        ease: 'Cubic.In',
        onComplete: this.container.destroy,
      });
    }
  }
}
