import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended
    ],
    plugins: {
      'react-refresh': reactRefresh
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    rules: {
      // 自动修复用的核心规则
      'semi': ['error', 'never'], // 禁止分号
      'quotes': ['error', 'single'], // 强制单引号
      'comma-dangle': ['error', 'never'], // 禁止尾逗号
      'indent': ['error', 2], // 强制2空格缩进
      'max-len': ['error', { code: 120, tabWidth: 2 }], // 单行最大长度
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }]
    }
  }
])