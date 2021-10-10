// @ts-check

import 'core-js/stable/index.js'; // зачем эта зависимость?
import 'regenerator-runtime/runtime.js'; // разобраться почему когда коментишь регенератор, но появляется CORS проблемы
import '../assets/application.scss';
import ReactDOM from 'react-dom';

import init from './init.jsx';

const run = async () => {
  const vdom = await init();
  console.log(vdom);
  ReactDOM.render(
    vdom,
    document.getElementById('chat'),
  );
};

run();

export default init;
