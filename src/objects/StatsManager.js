import { GameObject } from '.';

export default class StatsManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.stats = {};
  }

  initialize() {
    this.statsList = this.scene.config.stats;
    this.startingStats = this.scene.config.starting_stats;

    // Add meters
    this.meters = this.scene.add.container(0, -140);
    const statsCount = this.statsList.length;
    const marginX = 420;
    const marginY = 40;
    const padding = 80;
    const meterHeight = 24;
    const meterPadding = 6;
    const meterWidth = (1920 - (marginX * 2) - (padding * (statsCount - 1))) / statsCount;
    let currentOffset = 0;
    
    this.statsList.map((stat, index) => {
      const level = parseInt(this.startingStats[index]);
      const background = this.scene.add.graphics({
        lineStyle: { width: 2, color: 0x3D54ED },
        fillStyle: { color: 0x1B1862 },
      }).fillRect(0, 0, meterWidth, meterHeight).strokeRect(0, 0, meterWidth, meterHeight);
      const meter = this.scene.add.graphics().fillStyle(0xFF5562).fillRect(0, 0, meterWidth - meterPadding * 2, meterHeight - meterPadding * 2);
      meter.x = meterPadding;
      meter.y = meterPadding;
      meter.scaleX = level / 100;
      const bar = this.scene.add.container(marginX + currentOffset, marginY);
      const text = this.scene.add.text(0, 50, this.scene.strings[this.scene.currentLanguage][stat], {
        ...this.scene.defaultTextSettings,
        fontSize: 22,
      });
      bar.add([background, meter, text]);
      this.stats[stat] = { level, meter };
      this.meters.add(bar);
      currentOffset += meterWidth + padding;
    });
  }
  
  handleDamage(line) {
    let didInflictDamage = false;
    this.statsList.map(statName => {
      const damage = parseInt(line[statName]);
      const stat = this.stats[statName];
      const previousLevel = stat.level;
      if (damage < 0 || damage > 0) {
        didInflictDamage = true;
        stat.level += damage;
        this.scene.tweens.add({
          targets: stat.meter,
          scaleX: stat.level / 100,
          delay: 500,
          duration: 700,
          ease: 'Power2',
        });
        
        if (statName === 'racism') {
          const nextFrame = Math.floor(stat.level / 20) + 1;
          // const previousFrame = Math.floor(previousLevel / 20) + 1;
          const animationName = `chuck_${nextFrame}`;
          if (nextFrame > 1 && nextFrame <= 5) {
            this.scene.chuck.play(animationName);
          } else {
            console.error('Attempted to play invalid animation', animationName);
          }
        }
      }
    });
    
    if (didInflictDamage) {
      this.scene.tweens.add({
        targets: this.meters,
        y: 0,
        duration: 500,
        ease: 'Power2',
        yoyo: true,
        hold: 1700,
      });
      
      setTimeout(this.scene.queue.advance.bind(this.scene), 3000);
    } else {
      this.scene.queue.advance();
    }
  }
}