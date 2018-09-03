import ActionBubble from './ActionBubble';
import GameObject from './GameObject';
import TextBubble from './TextBubble';
import TimedBubble from './TimedBubble';

export default class Person extends GameObject {
  constructor(scene, name, x, y, flipped = false) {
    super(scene);
    this.energy = 100;
    this.name = name;
    this.slug = name.split(' ').join('').toLowerCase();
    this.x = x;
    this.y = y;
    this.flipped = flipped;
    this.dots = scene.add.container(0, 1100);
  }

  say(text, branchName, callback, idleLine) {
    this.textBubble = branchName
      ? new TimedBubble(this.scene, this, text, callback, idleLine)
      : new TextBubble(this.scene, this, text, callback);
  }

  choose(branchLines, interlocutor, callback, index = 0) {
    const line = branchLines[index];

    const chooseCallback = () => {
      this.slideOutDots();
      this.handleReaction(line, interlocutor);
    };
    const dismissCallback = index < branchLines.length - 1
      ? () => { this.choose(branchLines, interlocutor, callback, index + 1); }
      : null;

    this.textBubble = new ActionBubble(
      this.scene,
      this,
      line[this.scene.responseField],
      chooseCallback,
      dismissCallback,
    );

    // Draw dots
    if (this.dots.list.length) {
      this.dots.removeAll();
    } else {
      this.slideInDots();
    }

    const dotOffset = 40;
    for (let i = 0; i < branchLines.length; i += 1) {
      const image = i < index ? 'x' : 'dot';
      const dot = this.scene.add.image(i * dotOffset, 0, 'atlas', image);

      if (image === 'dot') {
        dot.setScale(0.5, 0.5);
      }

      if (i === index) {
        this.scene.tweens.add({
          targets: dot,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Power2',
        });
      }

      this.dots.add(dot);
    }
    this.dots.x = 1920 / 2 - (((branchLines.length - 1) * dotOffset) / 2);
    console.log(this.dots.x);    
  }

  slideInDots() {
    this.scene.tweens.add({
      targets: this.dots,
      y: 1040,
      duration: 600,
      ease: 'Power2',
    });
  }

  slideOutDots() {
    this.scene.tweens.add({
      targets: this.dots,
      y: 1100,
      duration: 200,
      ease: 'Cubic.In',
      onComplete: () => this.dots.removeAll(),
    });
  }

  handleReaction(line, interlocutor) {
    const person = this.scene.characters[interlocutor];
    person.textBubble.remove();
    this.scene.queue.prequeue(this.scene.stats.handleDamage.bind(this.scene.stats, line));

    if (line[this.scene.reactionField] && line[this.scene.reactionField] !== ' ') {
      person.say(
        line[this.scene.reactionField],
        null,
        this.scene.queue.advance.bind(this.scene),
      );
    } else {
      this.scene.queue.advance();
    }
  }

  handleIdleResponse(line, interlocutor) {
    this.slideOutDots();
    const player = this.scene.characters.Player;
    player.textBubble.remove();
    player.say(
      line[this.scene.responseField],
      null,
      () => { this.handleReaction(line, interlocutor); },
    );
  }
}
