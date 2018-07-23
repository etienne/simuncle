import 'phaser';
import { Person, DialogManager, FocusManager, GoogleSheetManager, QueueManager, StatsManager } from '../objects';

export default class Main extends Phaser.Scene {
  preload() {
    // Manage managers
    this.dialogs = new DialogManager(this);
    this.googleSheets = new GoogleSheetManager(this);
    this.queue = new QueueManager(this);
    this.stats = new StatsManager(this);
    this.focus = new FocusManager(this);

    // Load assets
    this.load.atlas('atlas', 'atlas.png', 'atlas.json');
    ['config', 'strings'].map(key => this.load.text(key, this.googleSheets.getSheetURL(`_${key}`)));
    this.currentLanguage = localStorage.getItem('language') || 'fr';
    ['text', 'response', 'reaction'].map(field => this[`${field}Field`] = `${field}_${this.currentLanguage}`);
    this.dialogs.load('intro');

    // Configure things
    this.defaultTextSettings = {
      fontFamily: 'Nunito Sans',
      fontSize: 27,
      color: '#E0ECDF',
      baselineX: 10,
      lineSpacing: 6,
    };
    this.input.setDefaultCursor('url(cursor.png) 12 4, pointer');
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

    // Set up start button
    const startBackground = this.add.image(0, 0, 'atlas', 'start');
    const startText = this.add.text(0, 0, this.strings[this.currentLanguage].start, this.defaultTextSettings);
    const startTextX = -startText.width / 2;
    const startTextY = -16;
    startText.x = startTextX;
    startText.y = startTextY;
    const start = this.add.container(960, 925).setAlpha(0).setSize(startBackground.width, startBackground.height).setInteractive();
    start.add([startBackground, startText]);
    start.on('focus', () => startBackground.setFrame('start_focus'));
    start.on('blur', () => startBackground.setFrame('start'));
    start.on('pointerover', () => startBackground.setFrame('start_hover'));
    start.on('pointerout', () => {
      startBackground.setFrame('start');
      startText.x = startTextX;
      startText.y = startTextY;
    });
    start.on('pointerdown', () => {
      startBackground.setFrame('start_active');
      startText.x = startTextX + 3;
      startText.y = startTextY - 3;
    });
    start.on('pointerup', () => {
      startBackground.setFrame('start');
      startText.x = startTextX
      startText.y = startTextY;
      this.tweens.add({
        targets: [title, start, languageSwitch],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.focus.unregister(start);
          this.focus.unregister(languageSwitch);
          this.dialogs.start('intro');
          start.destroy();
          languageSwitch.destroy();
        },
      });
    });

    this.stats.initialize();
    
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
    const languageUnderline = this.add.graphics({
      lineStyle: { width: 2, color: 0xE0ECDF },
    }).lineBetween(
      languageSwitch.x,
      languageSwitch.y + 26,
      languageSwitch.x + languageSwitch.width,
      languageSwitch.y + 26
    );
    languageUnderline.setAlpha(0);
    languageSwitch.on('pointerover', () => languageUnderline.setAlpha(1));
    languageSwitch.on('pointerout', () => languageUnderline.setAlpha(0));
    languageSwitch.on('focus', () => languageUnderline.setAlpha(1));
    languageSwitch.on('blur', () => languageUnderline.setAlpha(0));
    languageSwitch.on('pointerup', () => {
      localStorage.setItem('language', otherLanguage);
      this.scene.restart();
    });

    // Add characters
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

    // Set up keyboard navigation
    this.focus.register(start);
    this.focus.register(languageSwitch);
  }
}
