import { parseGroupSort } from './groupSort'

describe('parseGroupSort', () => {
  it.each([
    'code',
    'startedAtDate',
    'earliestPossibleStartDate',
    'probationDeliveryUnitName',
    'deliveryLocationName',
    'cohort',
    'sex',
  ])('accepts the API property %s in both directions', field => {
    expect(parseGroupSort([`${field},asc`])).toEqual([field, 'asc'])
    expect(parseGroupSort([`${field},desc`])).toEqual([field, 'desc'])
  })

  it.each(['startDate', 'earliestStartDate'])('normalises %s to the date field for the selected tab', field => {
    expect(parseGroupSort([`${field},desc`], 'earliestPossibleStartDate')).toEqual([
      'earliestPossibleStartDate',
      'desc',
    ])
    expect(parseGroupSort([`${field},desc`], 'startedAtDate')).toEqual(['startedAtDate', 'desc'])
  })

  it.each([
    ['pdu,asc', 'probationDeliveryUnitName'],
    ['deliveryLocation,asc', 'deliveryLocationName'],
  ])('translates retained links using %s', (value, field) => {
    expect(parseGroupSort([value])).toEqual([field, 'asc'])
  })

  it.each(
    [[], ['code,asc', 'sex,desc'], ['invalid,asc'], ['code,invalid'], ['code'], ['code,asc,extra']].map(values => ({
      values,
    })),
  )('uses the group-code default for invalid or missing sort values: $values', ({ values }) => {
    expect(parseGroupSort(values)).toEqual(['code', 'asc'])
  })
})
