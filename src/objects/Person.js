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
    const energyBackground = scene.add.image(0, 0, 'atlas', 'energyBackground').setOrigin(0);
    this.energyLevel = scene.add.image(6, 6, 'atlas', 'energyLevel').setOrigin(0);
    this.energyBar = scene.add.container(x - 122 / 2, y).setAlpha(0);
    this.energyBar.add([energyBackground, this.energyLevel]);
    this.dots = scene.add.container(0, 1100);
  }
  
  damage(energy) {
    this.energy -= energy;
    this.scene.tweens.add({
      targets: this.energyBar,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
      yoyo: true,
      hold: 1300,
    });
    this.scene.tweens.add({
      targets: this.energyLevel,
      scaleX: this.energy / 100,
      delay: 300,
      duration: 500,
      ease: 'Power2',
    });
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
      
      if (line.player > 0 || line.uncle > 0 || line.peace > 0) {
        this.scene.prequeueEvent(this.scene.handleDamage.bind(this.scene, line));
      }
      
      if (line.reaction && line.reaction !== ' ') {
        uncle.say(line.reaction, null, this.scene.advanceQueue.bind(this.scene));
      } else {
        this.scene.advanceQueue();
      }
    };
    
    const dismissCallback = index < branch.length - 1
      ? () => {
        this.choose(branch, callback, index + 1);
      }
      : null;

    this.textBubble = new ActionBubble(this.scene, line.response, this.slug, this.x, this.y, this.flipped, chooseCallback, dismissCallback);
    
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
    console.log('slideInDots');
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
    this.scene.prequeueEvent(this.scene.handleDamage.bind(this.scene, { player: 20 }));
    this.say('…', null, this.scene.advanceQueue.bind(this.scene));
  }
}
