import { GameObject } from '.';

export default class FocusManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.targets = [];
    this.scene.input.keyboard.on('keydown_LEFT', this.previous, this);
    this.scene.input.keyboard.on('keydown_RIGHT', this.next, this);
    this.scene.input.keyboard.on('keydown_TAB', this.next, this);
    this.scene.input.keyboard.on('keydown_ENTER', this.activate, this);
    this.scene.input.keyboard.on('keydown_SPACE', this.activate, this);
    this.register(this.scene.input);
    this.set(0);
  }

  register(gameObject) {
    this.targets.push(gameObject);
  }

  unregister(gameObject) {
    this.targets = this.targets.filter(target => gameObject !== target);
    if (this.targets.indexOf(this.current) === -1) {
      this.set(0);
    }
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
    this.targets.map(target => target.emit('blur'));
    this.currentIndex = index;
    this.current = this.targets[this.currentIndex];
    this.current.emit('focus');
    console.log('new index is', index, 'with object', this.current);
  }

  activate() {
    this.current.emit('pointerdown');
    this.current.emit('pointerup');
  }
}
