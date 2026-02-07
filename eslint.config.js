import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier/flat";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import ReactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["docs/**", "coverage/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactRefresh.configs.recommended,
  react.configs.flat.recommended,
  prettier,
  eslintPluginPrettier,
  {
    plugins: {
      "react-hooks": ReactHooks,
    },
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
      ...ReactHooks.configs.recommended.rules,
      curly: "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
    },
  }
);
