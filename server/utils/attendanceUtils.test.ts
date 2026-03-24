import attendanceOptionText from './attendanceUtils'

describe('attendanceUtils', () => {
  describe('attendanceOptionText', () => {
    it('renders the attended tag for codes and text values', () => {
      expect(attendanceOptionText('ATTC')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })

      expect(attendanceOptionText('Attended - Complied')).toEqual({
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

    it('renders a custom attended label when requested', () => {
      expect(attendanceOptionText('ATTC', { attendedLabel: 'Attended - Complied' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended - Complied</span>',
      })
    })

    it('uses the requested fallback when the value is not recognised', () => {
      expect(attendanceOptionText('unexpected value')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>',
      })

      expect(attendanceOptionText('No - did not attend')).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--grey">To be confirmed</span>',
      })

      expect(attendanceOptionText('unexpected value', { fallbackStatus: 'notAttended' })).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })
  })
})
