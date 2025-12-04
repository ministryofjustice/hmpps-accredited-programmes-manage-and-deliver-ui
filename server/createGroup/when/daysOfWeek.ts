export type DayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export type DayConfig = {
  key: DayKey
  idBase: string
  label: string
}

export const DAY_CONFIG: DayConfig[] = [
  { key: 'MONDAY', idBase: 'monday', label: 'Mondays' },
  { key: 'TUESDAY', idBase: 'tuesday', label: 'Tuesdays' },
  { key: 'WEDNESDAY', idBase: 'wednesday', label: 'Wednesdays' },
  { key: 'THURSDAY', idBase: 'thursday', label: 'Thursdays' },
  { key: 'FRIDAY', idBase: 'friday', label: 'Fridays' },
  { key: 'SATURDAY', idBase: 'saturday', label: 'Saturdays' },
  { key: 'SUNDAY', idBase: 'sunday', label: 'Sundays' },
]
