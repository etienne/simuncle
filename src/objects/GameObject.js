export default class GameObject {
  constructor(scene) {
    this.scene = scene;
  }

  createFallback(type, content, speakNow) {
    this.fallback = document.createElement(type);

    if (content) {
      this.fallback.textContent = content;
    }

    if (speakNow) {
      this.fallback.setAttribute('role', 'alert');
    }

    this.scene.sys.canvas.appendChild(this.fallback);
  }

  removeFallback() {
    this.fallback.remove();
  }
}
