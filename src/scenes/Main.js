import 'phaser';
import Papa from 'papaparse';
import { Person } from '../objects';
import shuffle from '../helpers/shuffle';
import locationQuery from '../helpers/locationQuery';

export default class Main extends Phaser.Scene {
  preload() {
    this.googleDocId = '1gQRnrK2_pidsdrJyipDWMRGfZs52Rj2kKx3jy4VBivg';
    this.queue = [];
    this.dialogs = {};
    this.load.atlas('atlas', 'atlas.png', 'atlas.json');
    ['config', 'strings'].map(key => this.load.text(key, this.getGoogleSheetURL(`_${key}`)));
    this.currentLanguage = localStorage.getItem('language') || 'fr';
    ['text', 'response', 'reaction'].map(field => this[`${field}Field`] = `${field}_${this.currentLanguage}`);
    this.loadDialogs('intro');
    this.defaultTextSettings = {
      fontFamily: 'Nunito Sans',
      fontSize: 27,
      color: '#E0ECDF',
      baselineX: 10,
      lineSpacing: 6,
    };
  }

  create() {
    // Parse config
    this.config = {};
    this.parseCSV(this.cache.text.get('config')).map(config => {
      const isArray = ['languages', 'stats'].indexOf(config.key) !== -1;
      this.config[config.key] = isArray ? config.value.split(',') : config.value;
    });
    
    // Parse strings
    this.strings = {};
    this.config.languages.map(language => this.strings[language] = {});
    this.parseCSV(this.cache.text.get('strings')).map(string => {
      this.config.languages.map(language => {
        this.strings[language][string.key] = string[language];
      });
    });
    
    // Add stuff to the scene
    const background = this.add.image(0, 0, 'atlas', 'background').setOrigin(0);
    const table = this.add.image(960, 600, 'atlas', 'table');
    const title = this.add.image(960, 200, 'atlas', `title_${this.currentLanguage}`).setAlpha(0);
    const startBorder = this.add.image(0, 0, 'atlas', 'buttonBorder');
    const startText = this.add.text(0, -16, this.strings[this.currentLanguage].start, this.defaultTextSettings);
    startText.x = -startText.width / 2;
    const start = this.add.container(960, 925).setAlpha(0).setSize(startBorder.width, startBorder.height).setInteractive();
    start.add([startText, startBorder]);
    
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
    const marginY = 60;
    const padding = 80;
    const meterHeight = 24;
    const meterPadding = 6;
    const meterWidth = (1920 - (marginX * 2) - (padding * (statsCount - 1))) / statsCount;
    let currentOffset = 0;
    
    this.config.stats.map(stat => {
      const background = this.add.graphics({
        lineStyle: { width: 2, color: 0x3D54ED },
        fillStyle: { color: 0x1B1862 },
      }).fillRect(0, 0, meterWidth, meterHeight).strokeRect(0, 0, meterWidth, meterHeight);
      const meter = this.add.graphics().fillStyle(0xFF5562).fillRect(0, 0, meterWidth - meterPadding * 2, meterHeight - meterPadding * 2);
      meter.x = meterPadding;
      meter.y = meterPadding;
      meter.scaleX = 0;
      const bar = this.add.container(marginX + currentOffset, marginY);
      const text = this.add.text(0, 50, this.strings[this.currentLanguage][stat], this.defaultTextSettings);
      bar.add([background, meter, text]);
      this.stats[stat] = {
        level: 0,
        meter,
      };
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
        onComplete: () => this.startDialog('intro'),
      });
    });
  }
  
  parseCSV(csv) {
    return Papa.parse(csv, { header: true }).data;
  }
  
  getGoogleSheetURL(name) {
    return `https://docs.google.com/spreadsheets/d/${this.googleDocId}/gviz/tq?tqx=out:csv&sheet=${name}`;
  }
  
  fetchSheet(name, onComplete) {
    Papa.parse(this.getGoogleSheetURL(name), {
      download: true,
      header: true,
      complete: results => {
        onComplete(results.data);
      },
    });
  }
  
  loadDialogs(entryPoint) {
    this.fetchSheet(entryPoint, dialog => {
      this.dialogs[entryPoint] = dialog;
      
      dialog.map(line => {
        if (line.branch) {
          this.fetchSheet(line.branch, branch => {
            this.dialogs[line.branch] = branch;
          });
        }
      });
    });
  }
  
  startDialog(name) {
    const dialog = this.dialogs[name];
    for (let i = 0; i < dialog.length; i++) {
      const line = dialog[i];
      this.enqueueEvent(() => {
        this.characters[line.person].say(line[this.textField], line.branch, this.advanceQueue.bind(this));
      });

      if (line.branch) {
        const branchLines = this.dialogs[line.branch];
        shuffle(branchLines);

        this.enqueueEvent(() => {
          this.characters['Player'].choose(branchLines, this.advanceQueue.bind(this));
        });
      }
    }
    
    if (locationQuery.skip > 0) {
      console.warn(`Skipping ${locationQuery.skip} events from beginning of queue`);
      this.queue.splice(0, locationQuery.skip);
    }
    
    this.advanceQueue();
  }
  
  enqueueEvent(event, delay) {
    this.queue.push({ event, delay });
  }
  
  prequeueEvent(event, delay) {
    this.queue.unshift({ event, delay });
  }
  
  advanceQueue() {
    const event = this.queue.shift();
    
    if (event) {
      if (event.delay) {
        setTimeout(event.event, event.delay)
      } else {
        event.event();
      }
    } else {
      this.scene.restart();
    }
  }
  
  handleDamage(line) {
    let didInflictDamage = false;
    this.config.stats.map(statName => {
      const damage = line[statName];
      const stat = this.stats[statName];
      if (damage > 0) {
        didInflictDamage = true;
        stat.level += parseInt(damage);
        this.tweens.add({
          targets: stat.meter,
          scaleX: stat.level / 100,
          delay: 500,
          duration: 700,
          ease: 'Power2',
        });
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
      setTimeout(this.advanceQueue.bind(this), 3000);
    } else {
      this.advanceQueue();
    }
  }
}
