import GameObject from './GameObject';
import Tab from './Tab';

export default class TabBar extends GameObject {
  constructor(scene, label, tabs) {
    super(scene);
    this.container = scene.add.container(40, 10);
    const text = scene.add.text(0, 0, label, { ...scene.defaultTextSettings });
    this.container.add(text);
    let xOffset = 0;

    tabs.forEach((tabData, index) => {
      let cap;
      if (index === 0) {
        cap = 'left';
      }
      if (index + 1 === tabs.length) {
        cap = 'right';
      }
      const tab = new Tab(scene, xOffset, 60, tabData.key, cap, tabData.action);
      xOffset += tab.width + 3;
      this.container.add(tab.container);
    });
  }
}
