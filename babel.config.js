module.exports = {
  'plugins': [
    '@babel/plugin-proposal-class-properties'
  ],
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': '> 0.25%, not dead',
        "exclude": ["transform-regenerator"]
      },
    ],
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  }
};
