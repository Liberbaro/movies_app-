module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier/react',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    curly: ['error'],
    'max-depth': ['warn', 4],
    'id-length': ['warn', { exceptions: ['i', 'j'], min: 2 }],
    'no-lonely-if': ['error'],
    'no-restricted-syntax': 'off',
    'class-methods-use-this': 'off',
    'jsx-a11y/href-no-hash': ['off'],
    'jsx-a11y/anchor-is-valid': ['off'],
    'react/jsx-props-no-spreading': 'off',
    'object-curly-newline': ['error', { multiline: true }],
    'react/static-property-placement': 'off',
    'arrow-body-style': 'off',
    'react/state-in-constructor': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': ['error', { props: false }],
    'one-var': ['error', 'always'],
    indent: ['error', 2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/control-has-associated-label': 'off',
  },
};
