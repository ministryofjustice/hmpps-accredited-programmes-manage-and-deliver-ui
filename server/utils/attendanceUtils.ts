type AttendanceStatus = 'attended' | 'failedToComply' | 'notAttended' | 'toBeConfirmed'

const ATTENDANCE_TAGS: Record<AttendanceStatus, { colour: string; label: string }> = {
  attended: { colour: 'blue', label: 'Attended' },
  failedToComply: { colour: 'yellow', label: 'Attended - failed to comply' },
  notAttended: { colour: 'red', label: 'Not attended' },
  toBeConfirmed: { colour: 'grey', label: 'To be confirmed' },
}

const ATTENDANCE_STATUS_BY_VALUE: Record<string, AttendanceStatus> = {
  ATTC: 'attended',
  ATTENDED: 'attended',
  'ATTENDED - COMPLIED': 'attended',
  Attended: 'attended',
  AFTC: 'failedToComply',
  'ATTENDED - FAILED TO COMPLY': 'failedToComply',
  'ATTENDED BUT FAILED TO COMPLY': 'failedToComply',
  'ATTENDED, FAILED TO COMPLY': 'failedToComply',
  'Attended, failed to comply': 'failedToComply',
  UAAB: 'notAttended',
  'DID NOT ATTEND': 'notAttended',
  'Did not attend': 'notAttended',
}

export default function attendanceOptionText(
  attendance: string | undefined,
  options: {
    attendedLabel?: string
    fallbackStatus?: AttendanceStatus
  } = {},
) {
  const normalisedAttendance = attendance?.trim().replace(/\s+/g, ' ').toUpperCase()
  const mappedStatus = normalisedAttendance ? ATTENDANCE_STATUS_BY_VALUE[normalisedAttendance] : undefined
  const status: AttendanceStatus = mappedStatus ?? options.fallbackStatus ?? 'toBeConfirmed'
  const tag = ATTENDANCE_TAGS[status]
  const label = status === 'attended' ? (options.attendedLabel ?? tag.label) : tag.label

  return {
    attendanceState: `<span class="govuk-tag govuk-tag--${tag.colour}">${label}</span>`,
  }
}
