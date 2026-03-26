import { Request } from 'express'
import AttendanceSessionNotesForm from './attendanceSessionNotesForm'

describe('AttendanceSessionNotesForm', () => {
  const buildRequest = (body: Record<string, unknown>): Request => ({ body }) as Request

  it('resolves notes value preferring attendee notes then bff notes then empty string', () => {
    const form = new AttendanceSessionNotesForm(buildRequest({}))

    expect(form.resolveNotesValue('Attendee note', 'BFF note')).toBe('Attendee note')
    expect(form.resolveNotesValue(undefined, 'BFF note')).toBe('BFF note')
    expect(form.resolveNotesValue(undefined, undefined)).toBe('')
  })

  it('returns form error when notes exceed 10000 characters', async () => {
    const req = buildRequest({
      'record-session-attendance-notes': 'a'.repeat(10001),
    })

    const result = await new AttendanceSessionNotesForm(req).sessionNotesData()

    expect(result.error).not.toBeNull()
    expect(result.paramsForUpdate).toBeNull()
    if (result.error) {
      expect(result.error.errors[0].errorSummaryLinkedField).toBe('record-session-attendance-notes')
    }
  })

  it('returns session notes params when input is valid', async () => {
    const req = buildRequest({
      'record-session-attendance-notes': 'Some notes',
    })

    const result = await new AttendanceSessionNotesForm(req).sessionNotesData()

    expect(result.error).toBeNull()
    expect(result.paramsForUpdate).toEqual({
      sessionNotes: 'Some notes',
      isSkipAndAddLater: false,
    })
  })

  it('skips validation when action is skip-and-add-later', async () => {
    const req = buildRequest({
      action: 'skip-and-add-later',
      'record-session-attendance-notes': 'a'.repeat(10001),
    })

    const result = await new AttendanceSessionNotesForm(req).sessionNotesData()

    expect(result.error).toBeNull()
    expect(result.paramsForUpdate).toEqual({
      sessionNotes: 'a'.repeat(10001),
      isSkipAndAddLater: true,
    })
  })
})
