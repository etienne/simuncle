module.exports = {
  "env": {
    "browser": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "object-curly-newline": 0, // We don't always want objects to be on multiple lines
    "max-len": ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
  }
};
