import Phaser from 'phaser';
import { Button, Person, DialogManager, GoogleSheetManager, QueueManager, StatsManager } from '../objects';

export default class Main extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }

  preload() {
    // Accessibility
    this.statusContainer = document.getElementById('status');
    while (this.sys.canvas.hasChildNodes()) {
      this.sys.canvas.removeChild(this.sys.canvas.lastChild);
    }

    // Manage managers
    this.dialogs = new DialogManager(this);
    this.googleSheets = new GoogleSheetManager(this);
    this.queue = new QueueManager(this);
    this.stats = new StatsManager(this);

    // Load assets
    this.load.atlas('atlas', 'atlas.png', 'atlas.json');
    ['_config', '_strings'].map(key => this.load.text(key, this.googleSheets.getSheetURL(key)));
    this.setLanguage(localStorage.getItem('language') || 'en');
    ['text', 'response', 'reaction'].forEach((field) => { this[`${field}Field`] = `${field}_${this.currentLanguage}`; });
    this.dialogs.load('intro');
    
    // Handle inaccessible remote assets
    this.load.on('loaderror', ({ key, url }) => {
      if (url.indexOf('http') !== -1) {
        this.load.text(key, `text/${key}.csv`);
      } else {
        console.log(key, url);
      }
    })

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
    GoogleSheetManager.parseCSV(this.cache.text.get('_config')).forEach((config) => {
      const isArray = ['languages', 'stats', 'starting_stats'].indexOf(config.key) !== -1;
      this.config[config.key] = isArray ? config.value.split(',') : config.value;
    });

    // Parse strings
    this.strings = {};
    this.config.languages.forEach((language) => { this.strings[language] = {}; });
    GoogleSheetManager.parseCSV(this.cache.text.get('_strings')).forEach((string) => {
      this.config.languages.forEach((language) => {
        this.strings[language][string.key] = string[language];
      });
    });
    this.l = this.strings[this.currentLanguage];

    // Add stuff to the scene
    this.add.image(0, 0, 'atlas', 'background').setOrigin(0);
    this.add.image(960, 600, 'atlas', 'table');
    // this.chuck = this.add.sprite(1320, 565, 'atlas', 'chuck_1');
    const title = this.add.image(960, 200, 'atlas', `title_${this.currentLanguage}`).setAlpha(0);
    // this.balloons = [];
    // [1, 2, 3, 4, 5].map(index => {
    //   this.balloons[index] = this.add.image(470, 700, 'atlas', `balloon_${index}`)
    //     .setOrigin(0.5, 1);
    //   this.balloons[index].setAngle(index * (index % 2 ? 2 : -2));
    //   this.tweens.add({
    //     targets: [this.balloons[index]],
    //     angle: index * (index % 2 ? -2 : 2),
    //     ease: 'Quad.easeInOut',
    //     duration: (index + Math.random() - 0.5) * 2222,
    //     yoyo: true,
    //     repeat: -1,
    //   });
    // });

    // Set up language switching
    const otherLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
    const languageSwitch = this.add.text(0, 25, this.l.otherLanguage, {
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
      languageSwitch.y + 26,
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

    // Set up settings button
    const settingsButton = new Button(this, 960 - 70, 925, 'settings', { fadeIn: true }, this.openSettings.bind(this));

    // Set up start button
    const startButton = new Button(this, 960 + 70, 925, 'start', { fadeIn: true }, () => {
      this.tweens.add({
        targets: [title, startButton.button, settingsButton.button, languageSwitch],
        alpha: 0,
        duration: 500,
        hold: 1500,
        onComplete: () => {
          this.dialogs.start('intro');
          startButton.remove();
          settingsButton.remove();
          languageSwitch.destroy();
        },
      });
      this.tweens.add({
        targets: this.stats.meters,
        y: 0,
        delay: 1000,
        duration: 500,
        ease: 'Power2',
      });
    });

    this.stats.initialize();

    // Create animations for Chuck the racist plant
    // [2, 3, 4, 5].map(frame => {
    //   this.anims.create({
    //     key: `chuck_${frame}`,
    //     frames: [frame - 1, frame].map(f => { return { key: 'atlas', frame: `chuck_${f}` } }),
    //     delay: 750,
    //     frameRate: 18,
    //     repeat: 5,
    //   });
    // });

    // Add characters
    this.characters = {
      /* eslint-disable key-spacing, no-multi-spaces, quote-props */
      'Cousin 1':  new Person(this, 'Cousin 1',  855,  340),
      'Uncle':     new Person(this, 'Uncle',     1025, 340),
      'Cousin 2':  new Person(this, 'Cousin 2',  1195, 340),
      'Mom':       new Person(this, 'Mom',       735,  490, true),
      'Player':    new Person(this, 'Player',    905,  490, true),
      'Bystander': new Person(this, 'Bystander', 1075, 490, true),
      /* eslint-enable key-spacing, no-multi-spaces, quote-props */
    };

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 500,
    });
  }

  setLanguage(language) {
    this.currentLanguage = language;
    document.documentElement.lang = language;
  }

  updateStatus(text) {
    this.statusContainer.textContent = text;
  }

  openSettings() {
    this.scene.run('settings', { l: this.l, defaultTextSettings: this.defaultTextSettings });
  }
}
