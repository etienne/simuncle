import 'phaser';
import reset from 'reset-css';
import '../assets/scss/styles.scss';
import { Main } from './scenes';

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'container',
  width: 1920,
  height: 1080,
  scene: Main,
  backgroundColor: 0x1b1862,
});
