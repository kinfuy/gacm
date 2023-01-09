module.exports = {
  extends: ['@alqmc/eslint-config-ts'],
  rules: {
    'operator-linebreak': ['error', 'before', { overrides: { '?': 'ignore', ':': 'ignore' } }]
  }
};
