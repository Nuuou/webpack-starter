import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';

function init() {
  render(<App />, document.getElementById('app'));
}

export default {
  init,
};
