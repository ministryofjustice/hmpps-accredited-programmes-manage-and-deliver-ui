import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

const base = Array.isArray(hmppsConfig) ? hmppsConfig : [hmppsConfig]

export default [
  ...base,
  { ignores: ['node_modules', 'public', 'assets', 'reporter-config.json', 'dist', 'test_results'] },
]
