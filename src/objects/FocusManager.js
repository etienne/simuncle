import { GameObject } from '.';

export default class FocusManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.targets = [];
    this.currentIndex = null;
    this.current = null;
    this.scene.input.keyboard.on('keydown_LEFT', this.previous, this);
    this.scene.input.keyboard.on('keydown_RIGHT', this.next, this);
    this.scene.input.keyboard.on('keydown_TAB', this.next, this);
    this.scene.input.keyboard.on('keydown_ENTER', this.activate, this);
    this.scene.input.keyboard.on('keydown_SPACEBAR', this.activate, this);
  }

  register(gameObject) {
    this.targets.push(gameObject);
  }

  unregister(gameObject) {
    this.targets.filter(target => {
      if (gameObject === target) {
        if (this.current === target) {
          this.currentIndex = null;
          this.current = null;
        }
        return false;
      } else {
        return true;
      }
    });
  }

  previous() {
    if (this.currentIndex && this.currentIndex > 0) {
      this.set(this.currentIndex - 1);
    } else {
      this.set(this.targets.length - 1);
    }
  }

  next() {
    if (Number.isInteger(this.currentIndex) && this.currentIndex < this.targets.length - 1) {
      this.set(this.currentIndex + 1);
    } else {
      this.set(0);
    }
  }

  set(index) {
    this.targets.map(target => target.setAlpha(1.0));
    this.currentIndex = index;
    this.current = this.targets[this.currentIndex];
    this.current.setAlpha(0.5);
  }

  activate() {
    if (this.current) {
      this.current.emit('pointerdown');
    }
  }
}
