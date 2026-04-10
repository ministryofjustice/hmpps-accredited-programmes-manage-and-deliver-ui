import SessionNotesForm from './sessionNotesForm'

describe('SessionNotesForm', () => {
  it('validates session notes within character limit', () => {
    const form = new SessionNotesForm()
    const notes = 'a'.repeat(10000)

    expect(form.validateSessionNotes(notes)).toBeNull()
  })

  it('validates session notes under character limit', () => {
    const form = new SessionNotesForm()
    const notes = 'a'.repeat(5000)

    expect(form.validateSessionNotes(notes)).toBeNull()
  })

  it('returns validation error when session notes exceed character limit', () => {
    const form = new SessionNotesForm()
    const notes = 'a'.repeat(10001)

    expect(form.validateSessionNotes(notes)).toEqual({
      errors: [
        {
          formFields: ['sessionNotes'],
          errorSummaryLinkedField: 'sessionNotes',
          message: expect.any(String),
        },
      ],
    })
  })

  it('returns validation error for significantly over limit notes', () => {
    const form = new SessionNotesForm()
    const notes = 'a'.repeat(20000)

    expect(form.validateSessionNotes(notes)).toEqual({
      errors: [
        {
          formFields: ['sessionNotes'],
          errorSummaryLinkedField: 'sessionNotes',
          message: expect.any(String),
        },
      ],
    })
  })

  it('treats CRLF line endings as a single character for length validation', () => {
    const form = new SessionNotesForm()
    const notes = 'a\r\n'.repeat(5000)

    expect(form.validateSessionNotes(notes)).toBeNull()
  })

  it('validates empty session notes', () => {
    const form = new SessionNotesForm()

    expect(form.validateSessionNotes('')).toBeNull()
  })
})
