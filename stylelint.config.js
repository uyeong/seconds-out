export default {
  extends: [
    'stylelint-config-standard-scss',
  ],
  plugins: [
    'stylelint-prettier',
    'stylelint-scss'
  ],
  rules: {
    'prettier/prettier': true,
    // Additional rules can be added here
    'selector-class-pattern': null, // Disable the class name pattern rule if you have custom naming conventions
    'color-function-notation': 'modern', // Modern notation is used in the files
    'declaration-block-no-redundant-longhand-properties': null, // Allow longhand properties
    'function-no-unknown': null, // Allow custom functions
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['custom-variant', 'theme']
      }
    ],
    'scss/operator-no-unspaced': null, // Allow unspaced operators
  },
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    '.yarn/**/*',
  ],
} 
