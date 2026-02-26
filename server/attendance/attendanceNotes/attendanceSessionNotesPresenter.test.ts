import AttendanceSessionNotesPresenter from './attendanceSessionNotesPresenter'
import AttendanceSessionNotesView from './attendanceSessionNotesView'
import recordSessionAttendanceFactory from '../../testutils/factories/recordSessionAttendanceFactory'

describe('AttendanceSessionNotesView', () => {
  const recordAttendanceBffData = recordSessionAttendanceFactory.build()
  const person = recordAttendanceBffData.people[0]

  describe('summaryListArgs', () => {
    it('should generate summary list with correct structure', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Yes - attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const summaryListArgs = args.summaryListArgs as Record<string, unknown>

      expect(summaryListArgs).not.toBeNull()
      expect((summaryListArgs as { rows: unknown[] }).rows).toHaveLength(1)
      expect((summaryListArgs as { rows: Array<{ key: { text: string } } & unknown> }).rows[0].key.text).toBe(
        'Attendance',
      )
      expect((summaryListArgs as { rows: Array<{ value: { html: string } } & unknown> }).rows[0].value.html).toContain(
        'Attended',
      )
    })

    it('should include change action with correct link', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Yes - attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const summaryListArgs = args.summaryListArgs as Record<string, unknown>

      const action = (summaryListArgs as { rows: Array<{ actions: { items: unknown[] } } & unknown> }).rows[0].actions
        .items[0]
      expect((action as Record<string, unknown>).text).toBe('Change')
      expect((action as Record<string, unknown>).href).toBe('/group/111/session/6789/record-attendance')
      expect((action as Record<string, unknown>).visuallyHiddenText).toContain(person.name)
      expect((action as Record<string, unknown>).visuallyHiddenText).toContain('attendance')
    })

    // it('should return null if personName is missing', () => {
    //   const presenter = new AttendanceSessionNotesPresenter(
    //     null,
    //     recordAttendanceBffData,
    //     '111',
    //     '6789',
    //     null,
    //     'Yes - attended',
    //   )
    //   const view = new AttendanceSessionNotesView(presenter)

    //   const [, args] = view.renderArgs
    //   expect(args.summaryListArgs).toBeNull()
    // })

    it('should return null if attendanceOptionText is missing', () => {
      const presenterWithNullAttendance = {
        personName: person.name,
        attendanceOptionText: null,
        backLinkUri: '/group/111/session/6789/record-attendance',
        text: {
          recordsSessionNotesCharacterCount: {
            label: 'Add session notes',
            hint: undefined,
          },
        },
        fields: {
          recordSessionAttendanceNotes: {
            errorMessage: null,
            attendanceValue: '',
          },
        },
        errorSummary: [],
      } as Record<string, unknown>

      const view = new AttendanceSessionNotesView(
        presenterWithNullAttendance as unknown as AttendanceSessionNotesPresenter,
      )

      const [, args] = view.renderArgs
      expect(args.summaryListArgs).toBeNull()
    })
  })

  describe('characterCountArgs', () => {
    it('should include hint text for "Attended but failed to comply"', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Attended but failed to comply',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const characterCountArgs = args.characterCountArgs as Record<string, unknown>

      expect((characterCountArgs as { hint?: { text: string } }).hint?.text).toBe(
        'Include details of why the person attended but failed to comply.',
      )
    })

    it('should not include hint text when attendance is "Yes - attended"', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Yes - attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const characterCountArgs = args.characterCountArgs as Record<string, unknown>

      expect((characterCountArgs as { hint?: { text: string } }).hint?.text).toBeUndefined()
    })

    it('should not include hint text when attendance is "Not attended"', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'No - not attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const characterCountArgs = args.characterCountArgs as Record<string, unknown>

      expect((characterCountArgs as { hint?: { text: string } }).hint?.text).toBeUndefined()
    })
  })
  it('should pass through the current attendance notes value', () => {
    const presenterWithValue = {
      personName: person.name,
      attendanceOptionText: { html: '<span>Attended</span>' },
      backLinkUri: '/group/111/session/6789/record-attendance',
      text: {
        recordsSessionNotesCharacterCount: {
          label: 'Add session notes',
          hint: undefined,
        },
      },
      fields: {
        recordSessionAttendanceNotes: {
          errorMessage: null,
          attendanceValue: 'Some notes already entered',
        },
      },
      errorSummary: [],
    } as Record<string, unknown>

    const view = new AttendanceSessionNotesView(presenterWithValue as unknown as AttendanceSessionNotesPresenter)

    const [, args] = view.renderArgs
    const characterCountArgs = args.characterCountArgs as Record<string, unknown>
    expect((characterCountArgs as { value: string }).value).toBe('Some notes already entered')
  })

  describe('renderArgs', () => {
    it('should return correct template name and args', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Yes - attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [templateName, args] = view.renderArgs

      expect(templateName).toBe('attendance/recordAttendanceNotes')
      expect(args).toHaveProperty('backLinkArgs')
      expect(args).toHaveProperty('characterCountArgs')
      expect(args).toHaveProperty('summaryListArgs')
      expect(args).toHaveProperty('text')
    })

    it('should include back link pointing to record-attendance page', () => {
      const presenter = new AttendanceSessionNotesPresenter(
        null,
        recordAttendanceBffData,
        '111',
        '6789',
        person,
        'Yes - attended',
      )
      const view = new AttendanceSessionNotesView(presenter)

      const [, args] = view.renderArgs
      const backLinkArgs = args.backLinkArgs as Record<string, unknown>

      expect((backLinkArgs as { text: string }).text).toBe('Back')
      expect((backLinkArgs as { href: string }).href).toBe('/group/111/session/6789/record-attendance')
    })
  })
})
