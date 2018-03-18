export default function createElement(type, className, id = null) {
  const element = document.createElement('div');
  element.className = className;
  element.id = id;
  return element;
}
