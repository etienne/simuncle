import GameObject from './GameObject';

export default class StatsManager extends GameObject {
  constructor(scene) {
    super(scene);
    this.stats = {};
  }

  initialize() {
    this.statsList = this.scene.config.stats;
    this.startingStats = this.scene.config.starting_stats;

    // Add meters
    this.meters = this.scene.add.container(0, -180);
    const statsCount = this.statsList.length;
    const marginX = 60;
    const marginY = 50;
    const padding = 1200;
    const meterWidth = (1920 - (marginX * 2) - (padding * (statsCount - 1))) / statsCount;
    let currentOffset = 0;

    this.statsList.forEach((stat, index) => {
      const level = parseInt(this.startingStats[index], 10);
      const background = this.scene.add.image(0, 0, 'atlas', `${stat}_background`)
        .setOrigin(0, 0);
      const meter = this.scene.add.image(0, 0, 'atlas', `${stat}_meter`)
        .setOrigin(0, 0)
        .setCrop(0, 0, 0, 0);
      const bar = this.scene.add.container(marginX + currentOffset, marginY);
      const text = this.scene.add.text(0, 70, this.scene.l[stat], {
        ...this.scene.defaultTextSettings,
        color: '#7387E8',
        fontSize: 22,
      });
      if (index % 2) {
        text.x = meter.width - text.width;
      }
      bar.add([background, meter, text]);
      this.stats[stat] = { level, meter };
      this.meters.add(bar);
      currentOffset += meterWidth + padding;
    });
  }

  handleDamage(line) {
    let didInflictDamage = false;
    this.statsList.forEach((statName) => {
      const damage = parseInt(line[statName], 10);
      const stat = this.stats[statName];
      const previousLevel = stat.level;
      if (damage < 0 || damage > 0) {
        didInflictDamage = true;
        stat.level += damage;
        this.scene.tweens.addCounter({
          from: previousLevel,
          to: stat.level,
          onUpdate: (tween, { value }) => {
            const width = stat.meter.width * (value / 100);
            stat.meter.setCrop(statName === 'racism' ? stat.meter.width - width : 0, 0, width, stat.meter.height);
          },
          delay: 200,
          duration: 800,
          ease: 'Power2',
        });

        // if (statName === 'racism') {
        //   const nextFrame = Math.floor(stat.level / 20) + 1;
        //   // const previousFrame = Math.floor(previousLevel / 20) + 1;
        //   const animationName = `chuck_${nextFrame}`;
        //   if (nextFrame > 1 && nextFrame <= 5) {
        //     this.scene.chuck.play(animationName);
        //   } else {
        //     console.error('Attempted to play invalid animation', animationName);
        //   }
        // }
      }
    });

    if (didInflictDamage) {
      setTimeout(this.scene.queue.advance.bind(this.scene), 2000);
    } else {
      this.scene.queue.advance();
    }
  }
}
