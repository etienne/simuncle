import createElement from '../helpers/createElement';
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
  
  choose(branch, callback) {
    const line = branch.shift();
    const player = this.scene.characters['Player'];
    const uncle = this.scene.characters['Uncle'];

    const chooseCallback = () => {
      uncle.textBubble.remove();
      
      const callbackWithDamage = () => {
        let willDamage = false;
        if (line.player > 0) {
          willDamage = true;
          player.damage(line.player);
        }
        if (line.uncle > 0) {
          willDamage = true;
          uncle.damage(line.uncle);
        }
        if (line.peace > 0) {
          this.scene.damagePeace(line.peace);
        }
        
        if (willDamage) {
          setTimeout(callback, 2000);
        } else {
          callback();
        }
      };
      
      if (line.reaction && line.reaction !== ' ') {
        uncle.say(line.reaction, null, callbackWithDamage);
      } else {
        callbackWithDamage();
      }
    };
    const dismissCallback = branch.length
      ? () => { this.choose(branch, callback); }
      : null;

    this.textBubble = new ActionBubble(this.scene, line.response, this.slug, this.x, this.y, this.flipped, chooseCallback, dismissCallback);
  }
  
  autoChoose(timedBubble) {
    if (this.textBubble) {
      this.textBubble.choose();
    } else {
      console.warn('Attempted to autoChoose but no ActionBubble is present');
    }
  }
}
