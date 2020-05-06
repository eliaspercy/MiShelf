module.exports = {
    extends: [
      'airbnb-base',
    ],
    plugins: [
      'import',
    ],
    env: {
      node: true,
      browser: true
    },
    rules: {
      'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
      'no-nested-ternary': 0
    }
    
  };