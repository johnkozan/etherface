import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { HttpStorage, BrowserStorage }  from './lib/storage';

let storage;

switch (window.REACT_APP_ETHERFACE_STORAGE) {
  case 'http':
    storage = new HttpStorage(window.REACT_APP_ETHERFACE_TEMPLATE_URL);
    break;

  default:
    storage = new BrowserStorage('etherface-file');
}

ReactDOM.render(
  <App storage={storage} />,
  document.querySelector('#root'),
);
