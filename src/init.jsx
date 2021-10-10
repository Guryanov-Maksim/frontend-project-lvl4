import 'core-js/stable/index.js'; // зачем эта зависимость?
import 'regenerator-runtime/runtime.js'; // разобраться почему когда коментишь регенератор, но появляется CORS проблемы
import '../assets/application.scss';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { io } from 'socket.io-client';

import WsProvider from './api/websocketApi.jsx';
// import i18n from './i18n.js';
import store from './app/store.js';
import App from './App.jsx';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as yup from 'yup';
import { ru, errors } from './locales/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbarConfig = {
  accessToken: 'bc37e9074f544386aa0bf55a590eda16',
  environment: 'production',
};

// сюда нужно вынести вебсокеты

export default async (socketClient) => {
  const defaultLanguage = 'ru';

  const i18nInstance = i18next.createInstance();

  yup.setLocale(errors);

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      debug: true,
      resources: {
        ru,
      },
    });

  const vdom = (
    <Provider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <WsProvider socket={socketClient}>
            <App />
          </WsProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </Provider>
  );

  return vdom;
};
