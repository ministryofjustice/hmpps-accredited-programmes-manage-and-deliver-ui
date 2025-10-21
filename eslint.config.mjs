// eslint.config.mjs
import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig(),

  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'public/**',
      'assets/**',
      'test_results/**',
      'reporter-config.json',
    ],
  },
]
