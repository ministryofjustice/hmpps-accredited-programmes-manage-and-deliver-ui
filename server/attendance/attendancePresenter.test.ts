import recordSessionAttendanceFactory from '../testutils/factories/recordSessionAttendanceFactory'
import AttendancePresenter from './attendancePresenter'

describe('AttendancePresenter', () => {
  describe('text', () => {
    describe('single attendee', () => {
      it('should return the correct page heading', () => {
        const bffData = recordSessionAttendanceFactory.build()
        bffData.people = [bffData.people[0]]
        const presenter = new AttendancePresenter(bffData, 'backlink', null)

        expect(presenter.text.pageHeading).toBe(`Did ${bffData.people[0].name} attend ${bffData.sessionTitle}?`)
      })
    })
    describe('multiple attendees', () => {
      it('should return the correct page heading', () => {
        const bffData = recordSessionAttendanceFactory.build()
        const presenter = new AttendancePresenter(bffData, 'backlink', null)

        expect(presenter.text.pageHeading).toBe(`Record attendance for ${bffData.sessionTitle}?`)
      })
    })
  })
})

describe('fields', () => {
  describe('single attendee', () => {
    it('should return a field with correct key for single attendee', () => {
      const bffData = recordSessionAttendanceFactory.build()
      bffData.people = [bffData.people[0]]
      const presenter = new AttendancePresenter(bffData, 'backlink', null)
      const { fields } = presenter

      const fieldKey = `attendance-${bffData.people[0].referralId}`
      expect(Object.keys(fields)).toContain(fieldKey)
      expect(Object.keys(fields).length).toBe(1)
    })
  })

  describe('multiple attendees', () => {
    it('should return fields for all attendees', () => {
      const bffData = recordSessionAttendanceFactory.build()
      const presenter = new AttendancePresenter(bffData, 'backlink', null)
      const { fields } = presenter

      expect(Object.keys(fields).length).toBe(bffData.people.length)
      bffData.people.forEach(person => {
        const fieldKey = `attendance-${person.referralId}`
        expect(Object.keys(fields)).toContain(fieldKey)
      })
    })
  })

  it('should return field with error message when validation error is passed', () => {
    const bffData = recordSessionAttendanceFactory.build()
    bffData.people = [bffData.people[0]]
    const fieldKey = `attendance-${bffData.people[0].referralId}`

    const validationError = {
      errors: [
        {
          formFields: [fieldKey],
          errorSummaryLinkedField: fieldKey,
          message: 'example error message',
        },
      ],
    }
    const presenter = new AttendancePresenter(bffData, 'backlink', validationError)
    const { fields } = presenter

    expect(fields[fieldKey].errorMessage).toBe('example error message')
  })
})
