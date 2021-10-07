import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as yup from 'yup';
import { ru, errors } from './locales/index.js';

const defaultLanguage = 'ru';

yup.setLocale(errors);

i18next
  .use(initReactI18next)
  .init({
    lng: defaultLanguage,
    debug: true,
    resources: {
      ru,
    },
  });

export default i18next;
