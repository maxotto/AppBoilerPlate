module.exports = {
  root: true,

  env: {
    node: true
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    indent: [
      'error',
      2
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1
      }
    ],
    'graphql/template-strings': [
      'error',
      {
        env: 'literal',
        projectName: 'app'
      }
    ]
  },

  'overrides': [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  plugins: [
    'graphql'
  ]
}
