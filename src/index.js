// @ts-check

import 'core-js/stable/index.js'; // зачем эта зависимость?
import 'regenerator-runtime/runtime.js'; // разобраться почему когда коментишь регенератор, но появляется CORS проблемы
import '../assets/application.scss';
import { render } from 'react-dom';

import init from './init.jsx';

const run = async () => {
  const vdom = await init();

  // if (document.getElementById('chat')) {
  render(vdom, document.getElementById('chat'));
  // }
};

run();

export default init;
