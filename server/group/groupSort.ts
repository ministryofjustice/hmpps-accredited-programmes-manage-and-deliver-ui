export const groupSortFields = ['code', 'start_date', 'pdu_name', 'delivery_location', 'cohort', 'sex'] as const

export type GroupSortField = (typeof groupSortFields)[number]

export type GroupSortDirection = 'asc' | 'desc'
export type GroupSort = readonly [GroupSortField, GroupSortDirection]

const defaultSort: GroupSort = ['code', 'asc']

export function parseGroupSort(sortValues: readonly string[]): GroupSort {
  if (sortValues.length !== 1) {
    return defaultSort
  }

  const parts = sortValues[0].split(',')
  const [field, direction] = parts

  return parts.length === 2 &&
    groupSortFields.includes(field as GroupSortField) &&
    (direction === 'asc' || direction === 'desc')
    ? [field as GroupSortField, direction]
    : defaultSort
}
