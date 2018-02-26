import { render } from 'inferno';
import './styles/index.styl';
import { App } from './App';

const ROOT = document.getElementById('app');

ROOT.innerHTML = null;

render(<App />, ROOT);

if (module.hot) {
  module.hot.accept();
}
