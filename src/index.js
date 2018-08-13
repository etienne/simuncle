import Phaser from 'phaser';
import 'reset-css';
import '../assets/scss/styles.scss';
import Main from './scenes/Main';

const width = 1920;
const height = 1080;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'container',
  width,
  height,
  scene: Main,
  backgroundColor: 0x1b1862,
});

function resize() {
  const ratio = width / height;
  let canvasHeight = window.innerHeight;
  let canvasWidth = canvasHeight * ratio;

  if (canvasWidth > window.innerWidth) {
    canvasWidth = window.innerWidth;
    canvasHeight = canvasWidth / ratio;
  }

  game.canvas.style.width = `${canvasWidth}px`;
  game.canvas.style.height = `${canvasHeight}px`;
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
