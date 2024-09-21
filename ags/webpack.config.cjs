const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
    
    ],
  },
  mode: 'production', // Set mode to 'production' or 'development' as needed
};