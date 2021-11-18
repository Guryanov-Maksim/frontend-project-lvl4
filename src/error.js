export const types = {
  network: 'network',
  conflict: 'conflict',
  unauthorized: 'unauthorized',
};

export default (error = {}, type) => ({ ...error, type });
