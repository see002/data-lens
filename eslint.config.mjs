import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["**/.next/**", "**/out/**", "**/build/**"],
  },
  ...compat.extends(
    "next",
    "next/core-web-vitals",
    "next/typescript",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ),
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
      react: reactPlugin,
    },
    rules: {
      // Remove unused imports entirely
      "unused-imports/no-unused-imports": "error",

      // Order imports and keep them alphabetized within groups
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // Ensure keys on array elements in JSX
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
    },
  },
];

export default eslintConfig;
