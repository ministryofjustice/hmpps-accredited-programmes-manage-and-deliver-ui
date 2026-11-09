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

export type CaselistSortDirection = 'asc' | 'desc'
export type CaselistSort = readonly [CaselistSortField, CaselistSortDirection]

const defaultSort: CaselistSort = ['personName', 'asc']

export function parseCaselistSort(sortValues: readonly string[]): CaselistSort {
  if (sortValues.length !== 1) {
    return defaultSort
  }

  const parts = sortValues[0].split(',')
  const [field, direction] = parts

  return parts.length === 2 &&
    caselistSortFields.includes(field as CaselistSortField) &&
    (direction === 'asc' || direction === 'desc')
    ? [field as CaselistSortField, direction]
    : defaultSort
}
