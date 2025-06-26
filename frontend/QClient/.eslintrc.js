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
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      tsx: true,
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier", "react-you-might-not-need-an-effect", "@typescript-eslint"],
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
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["/dist/*", "/node_modules/*", "/android/*", "/ios/*"],
};
