import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist', 'lib']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    files: ['**/*.test.ts'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off'
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2017,
        ...globals.jest
      }
    }
  },
  eslintConfigPrettier
)
