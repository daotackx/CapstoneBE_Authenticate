import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-useless-catch': 'off',
      'no-undef': 'off',
      "no-console": "off", // Tắt cảnh báo này
      "no-unused-vars": "off" // các rule khác nếu muốn
    }
  },
  pluginReact.configs.flat.recommended,
])
