import React from 'react';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import * as yup from 'yup';

import WsProvider from './api/websocketApi.jsx';
import store from './store.js';
import App from './App.jsx';

import { ru, errors } from './locales/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: 'production',
  enabled: process.env.NODE_ENV === 'production',
};

export default async (socketClient) => {
  yup.setLocale(errors);

  const defaultLanguage = 'ru';

  const i18nInstance = i18n.createInstance();

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      debug: process.env.NODE_ENV === 'development',
      resources: {
        ru,
      },
    });

  const vdom = (
    <I18nextProvider i18n={i18nInstance}>
      <Provider store={store}>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <WsProvider socket={socketClient}>
              <App />
            </WsProvider>
          </ErrorBoundary>
        </RollbarProvider>
      </Provider>
    </I18nextProvider>
  );

  return vdom;
};
