import { ActionBubble, GameObject, TextBubble, TimedBubble } from '.';

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
  
  say(text, branch, callback) {
    this.textBubble = branch
      ? new TimedBubble(this.scene, text, this.slug, this.x, this.y, this.flipped, callback)
      : new TextBubble(this.scene, text, this.slug, this.x, this.y, this.flipped, callback);
  }
  
  choose(branch, callback, index = 0) {
    const line = branch[index];
    const uncle = this.scene.characters['Uncle'];

    const chooseCallback = () => {
      uncle.textBubble.remove();
      this.slideOutDots();
      this.scene.queue.prequeue(this.scene.stats.handleDamage.bind(this.scene.stats, line));
      
      if (line[this.scene.reactionField] && line[this.scene.reactionField] !== ' ') {
        uncle.say(line[this.scene.reactionField], null, this.scene.queue.advance.bind(this.scene));
      } else {
        this.scene.queue.advance();
      }
    };
    
    const dismissCallback = index < branch.length - 1
      ? () => {
        this.choose(branch, callback, index + 1);
      }
      : null;
    
    this.textBubble = new ActionBubble(this.scene, line[this.scene.responseField], this.slug, this.x, this.y, this.flipped, chooseCallback, dismissCallback);
    
    // Draw dots
    if (this.dots.list.length) {
      this.dots.removeAll();
    } else {
      this.slideInDots();
    }
    
    const dotOffset = 40;
    for (let i = 0; i < branch.length; i++) {
      const image = i < index ? 'x' : 'dot';
      const dot = this.scene.add.image(i * dotOffset, 0, 'atlas', image);
      
      if (image == 'dot') {
        dot.setScale(0.5, 0.5);
      }
      
      if (i == index) {
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
    this.dots.x = 1920 / 2 - ((branch.length * dotOffset) / 2);
  }
  
  slideInDots() {
    this.scene.tweens.add({
      targets: this.dots,
      y: '-=60',
      duration: 600,
      ease: 'Power2',
    });
  }
  
  slideOutDots() {
    this.scene.tweens.add({
      targets: this.dots,
      y: '+=60',
      duration: 200,
      ease: 'Cubic.In',
      onComplete: () => this.dots.removeAll(),
    });
  }
  
  sayNothing() {
    this.scene.characters['Uncle'].textBubble.remove();
    this.textBubble.remove();
    this.slideOutDots();
    this.scene.queue.prequeue(this.scene.stats.handleDamage.bind(this.scene.stats, { racism: 20 }));
    this.say('…', null, this.scene.queue.advance.bind(this.scene));
  }
}
