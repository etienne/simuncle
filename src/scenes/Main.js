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
    this.peace = 100;
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

    const background = this.add.image(0, 0, 'atlas', 'background');
    const table = this.add.image(960, 600, 'atlas', 'table');
    const title = this.add.image(960, 200, 'atlas', `title_${this.currentLanguage}`).setAlpha(0);
    const startBorder = this.add.image(0, 0, 'atlas', 'buttonBorder');
    const startText = this.add.text(0, -16, this.strings[this.currentLanguage].start, this.defaultTextSettings);
    startText.x = -startText.width / 2;
    const start = this.add.container(960, 925).setAlpha(0).setSize(startBorder.width, startBorder.height).setInteractive();
    start.add([startText, startBorder]);
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

    background.setOrigin(0);
    
    this.characters = {
      'Cousin 1':  new Person(this, 'Cousin 1',  855,  340),
      'Uncle':     new Person(this, 'Uncle',     1025, 340),
      'Cousin 2':  new Person(this, 'Cousin 2',  1195, 340),
      'Mom':       new Person(this, 'Mom',       735,  490, true),
      'Player':    new Person(this, 'Player',    905,  490, true),
      'Bystander': new Person(this, 'Bystander', 1075, 490, true),
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
    if (line.player > 0) {
      this.characters['Player'].damage(line.player);
    }
    if (line.uncle > 0) {
      this.characters['Uncle'].damage(line.uncle);
    }
    if (line.peace > 0) {
      this.damagePeace(line.peace);
    }
    
    setTimeout(this.advanceQueue.bind(this), 2000);
  }
  
  damagePeace(peace) {
    this.peace -= peace;
  }
}
