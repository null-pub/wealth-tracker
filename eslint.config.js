import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier/flat";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-refresh";
import tseslint, { config } from "typescript-eslint";

export default config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.recommended,
  react.configs.flat.recommended,
  prettier,
  eslintPluginPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js", "vite.config.js"],
        },
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: tsParser,
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      curly: "error",
      "react/react-in-jsx-scope": "off",
    },
  }
);
