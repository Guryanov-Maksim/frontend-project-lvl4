// @ts-check

import 'core-js/stable/index.js'; // зачем эта зависимость?
import 'regenerator-runtime/runtime.js'; // разобраться почему когда коментишь регенератор, но появляется CORS проблемы
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import i18n from './i18n.js';
import store from './app/store.js';
import App from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbarConfig = {
  accessToken: 'bc37e9074f544386aa0bf55a590eda16',
  environment: 'production',
};

// сюда нужно вынести вебсокеты
const chat = document.querySelector('pre');
console.log(chat);

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  </Provider>,
  document.getElementById('chat'),
  chat,
);
