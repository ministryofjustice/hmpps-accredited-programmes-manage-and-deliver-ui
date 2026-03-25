import attendanceOptionText from './attendanceUtils'

describe('attendanceUtils', () => {
  describe('attendanceOptionText', () => {
    it('renders the attended tag for ATTC code', () => {
      expect(attendanceOptionText('ATTC')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })
    })

    it('renders the failed to comply tag for AFTC code', () => {
      expect(attendanceOptionText('AFTC')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>',
      })
    })

    it('renders the not attended tag for UAAB code', () => {
      expect(attendanceOptionText('UAAB')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })

    it('renders a custom attended label when requested', () => {
      expect(attendanceOptionText('ATTC', { attendedLabel: 'Attended - Complied' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended - Complied</span>',
      })
    })

    it('uses the requested fallback when the code is not recognised', () => {
      expect(attendanceOptionText('UNKNOWN')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>',
      })

      expect(attendanceOptionText('UNKNOWN', { fallbackStatus: 'notAttended' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })
  })
})
