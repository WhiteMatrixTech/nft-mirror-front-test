module.exports = {
  extends: ['@white-matrix/eslint-config'],
  parserOptions: {
    project: require.resolve('./tsconfig.json')
  },
  rules: {
    'no-void': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-type-alias': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
