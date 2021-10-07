export default {
  string: {
    min: ({ min }) => ({ key: 'lessThen', values: { min } }),
    max: 'tooLong',
  },
  mixed: {
    required: 'empty',
    oneOf: 'unmatched',
  },
};
