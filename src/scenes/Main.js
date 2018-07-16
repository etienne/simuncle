import 'phaser';
import { Person, DialogManager, GoogleSheetManager, QueueManager } from '../objects';

export default class Main extends Phaser.Scene {
  preload() {
    // Manage managers
    this.dialogs = new DialogManager(this);
    this.googleSheets = new GoogleSheetManager(this);
    this.queue = new QueueManager(this);

    // Load assets
    this.load.atlas('atlas', 'atlas.png', 'atlas.json');
    ['config', 'strings'].map(key => this.load.text(key, this.googleSheets.getSheetURL(`_${key}`)));
    this.currentLanguage = localStorage.getItem('language') || 'fr';
    ['text', 'response', 'reaction'].map(field => this[`${field}Field`] = `${field}_${this.currentLanguage}`);
    this.dialogs.load('intro');
    this.defaultTextSettings = {
      fontFamily: 'Nunito Sans',
      fontSize: 27,
      color: '#E0ECDF',
      baselineX: 10,
      lineSpacing: 6,
    };
    this.input.setDefaultCursor('url(cursor.png) 15 6, pointer');
  }

  create() {
    // Parse config
    this.config = {};
    this.googleSheets.parseCSV(this.cache.text.get('config')).map(config => {
      const isArray = ['languages', 'stats', 'starting_stats'].indexOf(config.key) !== -1;
      this.config[config.key] = isArray ? config.value.split(',') : config.value;
    });
    
    // Parse strings
    this.strings = {};
    this.config.languages.map(language => this.strings[language] = {});
    this.googleSheets.parseCSV(this.cache.text.get('strings')).map(string => {
      this.config.languages.map(language => {
        this.strings[language][string.key] = string[language];
      });
    });
    
    // Add stuff to the scene
    const background = this.add.image(0, 0, 'atlas', 'background').setOrigin(0);
    const table = this.add.image(890, 600, 'atlas', 'table');
    this.chuck = this.add.sprite(1320, 565, 'atlas', 'chuck_1');
    const title = this.add.image(960, 200, 'atlas', `title_${this.currentLanguage}`).setAlpha(0);
    const startBorder = this.add.image(0, 0, 'atlas', 'buttonBorder');
    const startText = this.add.text(0, -16, this.strings[this.currentLanguage].start, this.defaultTextSettings);
    startText.x = -startText.width / 2;
    const start = this.add.container(960, 925).setAlpha(0).setSize(startBorder.width, startBorder.height).setInteractive();
    start.add([startText, startBorder]);
    
    // Create animations for Chuck the racist plant
    [2, 3, 4, 5].map(frame => {
      this.anims.create({
        key: `chuck_${frame}`,
        frames: [frame - 1, frame].map(f => { return { key: 'atlas', frame: `chuck_${f}` } }),
        delay: 750,
        frameRate: 18,
        repeat: 5,
      });
    });
    
    // Set up language switching
    const otherLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
    const languageSwitch = this.add.text(0, 25, this.strings[this.currentLanguage].otherLanguage, {
      ...this.defaultTextSettings,
      fontSize: 20,
    }).setInteractive();
    languageSwitch.x = 1920 - languageSwitch.width - 32;
    languageSwitch.on('pointerdown', () => {
      localStorage.setItem('language', otherLanguage);
      this.scene.restart();
    });
    
    // Add stat meters
    this.stats = {};
    this.meters = this.add.container(0, -140);
    const statsCount = this.config.stats.length;
    const marginX = 420;
    const marginY = 40;
    const padding = 80;
    const meterHeight = 24;
    const meterPadding = 6;
    const meterWidth = (1920 - (marginX * 2) - (padding * (statsCount - 1))) / statsCount;
    let currentOffset = 0;
    
    this.config.stats.map((stat, index) => {
      const level = parseInt(this.config.starting_stats[index]);
      const background = this.add.graphics({
        lineStyle: { width: 2, color: 0x3D54ED },
        fillStyle: { color: 0x1B1862 },
      }).fillRect(0, 0, meterWidth, meterHeight).strokeRect(0, 0, meterWidth, meterHeight);
      const meter = this.add.graphics().fillStyle(0xFF5562).fillRect(0, 0, meterWidth - meterPadding * 2, meterHeight - meterPadding * 2);
      meter.x = meterPadding;
      meter.y = meterPadding;
      meter.scaleX = level / 100;
      const bar = this.add.container(marginX + currentOffset, marginY);
      const text = this.add.text(0, 50, this.strings[this.currentLanguage][stat], {
        ...this.defaultTextSettings,
        fontSize: 22,
      });
      bar.add([background, meter, text]);
      this.stats[stat] = { level, meter };
      this.meters.add(bar);
      currentOffset += meterWidth + padding;
    });
    
    this.characters = {
      'Cousin 1':  new Person(this, 'Cousin 1',  785,  340),
      'Uncle':     new Person(this, 'Uncle',     955, 340),
      'Cousin 2':  new Person(this, 'Cousin 2',  1125, 340),
      'Mom':       new Person(this, 'Mom',       665,  490, true),
      'Player':    new Person(this, 'Player',    835,  490, true),
      'Bystander': new Person(this, 'Bystander', 1005, 490, true),
    };
    
    const tween = this.tweens.add({
      targets: [title, start],
      alpha: 1,
      duration: 500,
    });
    
    start.on('pointerdown', () => {
      this.tweens.add({
        targets: [title, start, languageSwitch],
        alpha: 0,
        duration: 500,
        onComplete: () => this.dialogs.start('intro'),
      });
    });
  }
  
  handleDamage(line) {
    let didInflictDamage = false;
    this.config.stats.map(statName => {
      const damage = parseInt(line[statName]);
      const stat = this.stats[statName];
      const previousLevel = stat.level;
      if (damage < 0 || damage > 0) {
        didInflictDamage = true;
        stat.level += damage;
        this.tweens.add({
          targets: stat.meter,
          scaleX: stat.level / 100,
          delay: 500,
          duration: 700,
          ease: 'Power2',
        });
        
        if (statName === 'racism') {
          const nextFrame = Math.floor(stat.level / 20) + 1;
          const previousFrame = Math.floor(previousLevel / 20) + 1;
          const animationName = `chuck_${nextFrame}`;
          console.log('About to play animation', animationName);
          this.chuck.play(animationName);
        }
      }
    });
    
    if (didInflictDamage) {
      this.tweens.add({
        targets: this.meters,
        y: 0,
        duration: 500,
        ease: 'Power2',
        yoyo: true,
        hold: 1700,
      });
      
      setTimeout(this.queue.advance.bind(this), 3000);
    } else {
      this.queue.advance();
    }
  }
}
