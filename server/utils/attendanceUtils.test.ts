import attendanceOptionText from './attendanceUtils'

describe('attendanceUtils', () => {
  describe('attendanceOptionText', () => {
    it('renders the attended tag for codes and text values', () => {
      expect(attendanceOptionText('ATTC')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })

      expect(attendanceOptionText('Attended')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })
    })

    it('renders the failed to comply tag for both text variants', () => {
      expect(attendanceOptionText('Attended but failed to comply')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>',
      })

      expect(attendanceOptionText('Attended, failed to comply')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>',
      })
    })

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

    it('renders the not attended tag for not attended text', () => {
      expect(attendanceOptionText('Not attended')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })

    it('renders a custom attended label when requested', () => {
      expect(attendanceOptionText('ATTC', { attendedLabel: 'Attended' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })
    })

    it('uses the requested fallback when the value is not recognised', () => {
      expect(attendanceOptionText('unexpected value')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>',
      })

      expect(attendanceOptionText('No - did not attend')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>',
      })

      expect(attendanceOptionText('UNKNOWN', { fallbackStatus: 'notAttended' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })
  })
})
