const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  outputDir: 'dist',
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: ''
          }
        ]
      })
    ]
  }
};