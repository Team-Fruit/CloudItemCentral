module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "never", {"beforeStatementContinuationChars": "never"}],
        "semi-spacing": ["error", {"after": true, "before": false}],
        "semi-style": ["error", "first"],
        "no-extra-semi": "error",
        "no-unexpected-multiline": "error",
        "no-unreachable": "error",
        "no-unused-vars": "off",
        "no-useless-catch": "off"
    }
};