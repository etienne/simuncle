import GameObject from './GameObject';

export default class QueueManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.queue = [];
  }

  enqueue(event, delay) {
    this.queue.push({ event, delay });
  }

  prequeue(event, delay) {
    this.queue.unshift({ event, delay });
  }

  shift() {
    return this.queue.shift();
  }

  advance() {
    // FIXME: this is bound to scene
    const event = this.queue.shift();

    if (event) {
      if (event.delay) {
        setTimeout(event.event, event.delay);
      } else {
        event.event();
      }
    } else {
      this.scene.restart();
    }
  }

  skip(count) {
    console.info(`Skipping ${count} events from beginning of queue`);
    this.queue.splice(0, count);
  }
}
