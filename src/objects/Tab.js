import Button from './Button';

export default class Tab extends Button {
  constructor(scene, x, y, label, cap, callback) {
    super(scene, 0, 0, 'tab', { label }, callback);
    this.container = scene.add.container(x, y);

    const leftCap = cap === 'left' ? 'tab_outer_cap' : 'tab_inner_cap';
    const rightCap = cap === 'right' ? 'tab_outer_cap' : 'tab_inner_cap';
    this.leftCap = scene.add.image(0, 0, 'atlas', leftCap);
    this.rightCap = scene.add.image(0, 0, 'atlas', rightCap);
    this.rightCap.scaleX = -1;
    this.leftCap.setOrigin(0, 0);
    this.rightCap.setOrigin(1, 0);

    this.label = scene.add.text(this.leftCap.width, 14, scene.l[label], { ...scene.defaultTextSettings });

    this.button.x = this.leftCap.width;
    this.button.scaleX = this.label.width / this.button.width;
    this.button.setOrigin(0, 0);
    this.rightCap.x = this.button.displayWidth + this.rightCap.width;
    this.container.add([this.button, this.label, this.leftCap, this.rightCap]);
    this.width = this.leftCap.width + this.button.displayWidth + this.rightCap.width;
  }
}
