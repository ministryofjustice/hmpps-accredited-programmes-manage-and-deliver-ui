type AttendanceStatus = 'attended' | 'failedToComply' | 'notAttended' | 'toBeConfirmed'

type AttendanceOptionTextOptions = {
  attendedLabel?: string
  fallbackStatus?: AttendanceStatus
}

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
  AFTC: 'failedToComply',
  'ATTENDED - FAILED TO COMPLY': 'failedToComply',
  'ATTENDED BUT FAILED TO COMPLY': 'failedToComply',
  'ATTENDED, FAILED TO COMPLY': 'failedToComply',
  UAAB: 'notAttended',
  'DID NOT ATTEND': 'notAttended',
  'NOT ATTENDED': 'notAttended',
}

export const attendanceOptionTextTags: Record<'attendanceSessionNotes' | 'editSession', AttendanceOptionTextOptions> = {
  attendanceSessionNotes: { fallbackStatus: 'notAttended' },
  editSession: { attendedLabel: 'Attended - Complied' },
}

export default function attendanceOptionText(
  attendanceCode: string | undefined,
  options: AttendanceOptionTextOptions = {},
) {
  const normalisedAttendance = attendanceCode?.trim().replace(/\s+/g, ' ').toUpperCase()
  const status: AttendanceStatus =
    (normalisedAttendance ? ATTENDANCE_STATUS_BY_VALUE[normalisedAttendance] : undefined) ??
    options.fallbackStatus ??
    'toBeConfirmed'
  const { colour, label } = ATTENDANCE_TAGS[status]
  const displayLabel = status === 'attended' && options.attendedLabel ? options.attendedLabel : label

  return {
    attendanceState: `<span class="govuk-tag govuk-tag--${colour}">${displayLabel}</span>`,
  }
}
