// @ts-check

// import 'core-js/stable/index.js'; // зачем эта зависимость?
import 'regenerator-runtime/runtime.js'; // разобраться почему когда коментишь регенератор, но появляется CORS проблемы
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

// сюда нужно вынести вебсокеты

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('chat'),
);
