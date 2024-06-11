import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { 
    globals: globals.browser }, rules: {} },
  ...tseslint.configs.recommended,
];
