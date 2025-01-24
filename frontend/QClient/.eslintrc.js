// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    es2021: true, // Enables ES2021 syntax
  },
  extends: ["expo"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable linting for JSX
    },
    ecmaVersion: 12, // Use modern JavaScript syntax
    sourceType: "module", // Support ES modules
  },
  plugins: ["react"], // Include the React plugin
  rules: {
    "react/prop-types": "off", // Disable prop-types validation (optional)
  },
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
  },
  ignorePatterns: ["/dist/*"],
};
