import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        localStorage: "readonly",
        navigator: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
        alert: "readonly",
        URL: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        localStorage: "readonly",
        navigator: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
        alert: "readonly",
        URL: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
      },
    },
    plugins: {
      vue,
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js"],
  },
];
