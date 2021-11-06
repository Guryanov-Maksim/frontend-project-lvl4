import React from 'react';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import * as yup from 'yup';

import createApi from './api/index.js';
import store from './store.js';
import App from './App.jsx';
import { apiContext } from './contexts/index.js';

import { ru, errors } from './locales/index.js';

const defaultLanguage = 'ru';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: 'production',
  enabled: process.env.NODE_ENV === 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default async (socketClient) => {
  yup.setLocale(errors);

  const i18nInstance = i18n.createInstance();

  const api = createApi(store, socketClient);

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
            <apiContext.Provider value={api}>
              <App />
            </apiContext.Provider>
          </ErrorBoundary>
        </RollbarProvider>
      </Provider>
    </I18nextProvider>
  );

  return vdom;
};
