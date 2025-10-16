import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig(),

  // then your local tweaks
  {
    ignores: ['node_modules', 'public', 'assets', 'reporter-config.json', 'dist', 'test_results'],
  },
]
