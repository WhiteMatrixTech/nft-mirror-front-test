module.exports = {
  plugins: ['stylelint-prettier', 'stylelint-high-performance-animation'],
  extends: ['stylelint-prettier/recommended'],
  rules: {
    'prettier/prettier': true,
    'plugin/no-low-performance-animation-properties': true
  }
};
