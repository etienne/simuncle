import 'phaser';
import 'reset-css';
import '../assets/scss/styles.scss';
import { Main } from './scenes';

const width = 1920, height = 1080;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'container',
  width: width,
  height: height,
  scene: Main,
  backgroundColor: 0x1b1862,
});

function resize() {
  const ratio = width / height;
  let canvas_height = window.innerHeight;
  let canvas_width = canvas_height * ratio;

  if (canvas_width > window.innerWidth) {
    canvas_width = window.innerWidth;
    canvas_height = canvas_width/ratio;
  }

  game.canvas.style.width = canvas_width + 'px';
  game.canvas.style.height = canvas_height + 'px';
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
