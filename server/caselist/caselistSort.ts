export const caselistSortFields = [
  'personName',
  'pduName',
  'reportingTeam',
  'sentenceEndDate',
  'cohort',
  'sex',
  'status',
] as const

export type CaselistSortField = (typeof caselistSortFields)[number]
