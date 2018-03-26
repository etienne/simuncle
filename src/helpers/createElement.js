export default function createElement(type, className, id = null) {
  const element = document.createElement(type);
  element.className = className;
  element.id = id;
  return element;
}
