import './scss/styles.scss';

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = 'Hello salut';
  return element;
}

document.body.appendChild(component());
