const callCallbacks = (callbacks) => callbacks.forEach((cb) => cb());
const callCallbacksWithData = (callbacks, data) => callbacks.forEach((cb) => cb(data));

export { callCallbacks, callCallbacksWithData };
