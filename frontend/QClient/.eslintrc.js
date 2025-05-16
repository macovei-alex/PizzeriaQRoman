// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    "expo",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      tsx: true,
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier", "react-you-might-not-need-an-effect"],
  rules: {
    "react/prop-types": "error",
    "prettier/prettier": [
      "warn",
      {
        printWidth: 110,
        endOfLine: "crlf",
        trailingComma: "es5",
      },
    ],
    "react-you-might-not-need-an-effect/you-might-not-need-an-effect": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["/dist/*", "/node_modules/*", "/android/*", "/ios/*"],
};
