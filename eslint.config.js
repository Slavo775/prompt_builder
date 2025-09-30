import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";
import jsoncParser from "jsonc-eslint-parser";
import htmlPlugin from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";

export default [
  // Ignores
  {ignores: ["dist/**", "node_modules/**", "*.config.js", "**/*.html"]},

  // Base + Vue
  js.configs.recommended,
  ...vue.configs["flat/recommended"],

  // Browser globals for code files only
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      globals: {...globals.browser, ...globals.es2021},
    },
  },

  // TS files
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {"@typescript-eslint": tseslint},
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-undef": "off",
    },
  },

  // Vue SFCs
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {vue},
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },

  // JSON / JSONC
  {
    files: ["**/*.{json,jsonc,json5}"],
    languageOptions: {parser: jsoncParser},
  },
  {
    files: ["**/*.html"],
    languageOptions: {parser: htmlParser},
    plugins: {"@html-eslint": htmlPlugin},
    rules: {
      // example rules:
      "@html-eslint/indent": ["error", 2],
      "@html-eslint/no-duplicate-id": "error",
    },
  },
];
