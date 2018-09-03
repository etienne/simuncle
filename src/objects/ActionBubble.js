import TextBubble from './TextBubble';

export default class ActionBubble extends TextBubble {
  constructor(scene, person, text, chooseCallback, dismissCallback, { isFirst }) {
    super(scene, person, text, chooseCallback, { heightAdjustment: 25, isFirst });

    // Set up Dismiss button
    this.dismissButton = scene.add.image(this.width - 25 - 90 - 25, this.height, 'atlas', 'dismiss').setOrigin(1, 0.5).setInteractive();
    this.dismissButton.on('focus', () => this.dismissButton.setFrame('dismiss_focus'));
    this.dismissButton.on('blur', () => this.dismissButton.setFrame('dismiss'));
    this.dismissButton.on('pointerover', () => this.dismissButton.setFrame('dismiss_hover'));
    this.dismissButton.on('pointerout', () => this.dismissButton.setFrame('dismiss'));
    this.dismissButton.on('pointerdown', () => this.dismissButton.setFrame('dismiss_active'));
    this.scene.focus.register(this.dismissButton);

    // Set up Choose button
    this.chooseButton = scene.add.image(this.width - 25, this.height, 'atlas', 'choose').setOrigin(1, 0.5).setInteractive();
    this.chooseButton.on('focus', () => this.chooseButton.setFrame('choose_focus'));
    this.chooseButton.on('blur', () => this.chooseButton.setFrame('choose'));
    this.chooseButton.on('pointerover', () => this.chooseButton.setFrame('choose_hover'));
    this.chooseButton.on('pointerout', () => this.chooseButton.setFrame('choose'));
    this.chooseButton.on('pointerdown', () => this.chooseButton.setFrame('choose_active'));
    this.chooseButton.on('pointerup', () => {
      this.chooseButton.setFrame('choose');
      this.choose();
    });
    this.scene.focus.register(this.chooseButton);

    this.container.add([this.chooseButton, this.dismissButton]);
    this.container.bringToTop(this.face);
    this.chooseCallback = chooseCallback;

    if (dismissCallback) {
      this.dismissButton.on('pointerup', () => {
        this.dismissButton.setFrame('dismiss');
        setTimeout(() => {
          dismissCallback();
        }, 250);
        this.remove();
      });
    } else {
      this.scene.focus.unregister(this.dismissButton);
      this.dismissButton.setAlpha(0.25);
    }
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
    this.scene.focus.unregister(this.chooseButton);
    this.scene.focus.unregister(this.dismissButton);

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
