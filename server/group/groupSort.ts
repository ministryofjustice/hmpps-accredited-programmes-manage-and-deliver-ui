export const groupSortFields = [
  'code',
  'startedAtDate',
  'earliestPossibleStartDate',
  'probationDeliveryUnitName',
  'deliveryLocationName',
  'cohort',
  'sex',
] as const

export type GroupSortField = (typeof groupSortFields)[number]

export type GroupSortDirection = 'asc' | 'desc'
export type GroupSort = readonly [GroupSortField, GroupSortDirection]
export type GroupDateSortField = 'startedAtDate' | 'earliestPossibleStartDate'

const defaultSort: GroupSort = ['code', 'asc']

export function parseGroupSort(
  sortValues: readonly string[],
  dateField: GroupDateSortField = 'startedAtDate',
): GroupSort {
  if (sortValues.length !== 1) {
    return defaultSort
  }

  const parts = sortValues[0].split(',')
  const [requestedField, direction] = parts
  let field = requestedField

  // Translate links retained before the API sort property names were corrected.
  if (field === 'startDate' || field === 'earliestStartDate') {
    field = dateField
  } else if (field === 'pdu') {
    field = 'probationDeliveryUnitName'
  } else if (field === 'deliveryLocation') {
    field = 'deliveryLocationName'
  }

  return parts.length === 2 &&
    groupSortFields.includes(field as GroupSortField) &&
    (direction === 'asc' || direction === 'desc')
    ? [field as GroupSortField, direction]
    : defaultSort
}
