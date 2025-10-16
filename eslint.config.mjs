import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  hmppsConfig(),

  {
    ignores: ['node_modules', 'public', 'assets', 'reporter-config.json', 'dist', 'test_results'],
  },
]
