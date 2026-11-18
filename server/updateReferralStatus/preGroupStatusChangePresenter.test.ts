import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import PreGroupStatusChangePresenter from './preGroupStatusChangePresenter'

describe('PreGroupStatusChangePresenter', () => {
  const referralDetails = referralDetailsFactory.build()
  const backLinkUri = '/back-link'

  const buildPresenter = ({
    isAddToGroupJourney = false,
    attendanceOutcomeCode = undefined,
  }: {
    isAddToGroupJourney?: boolean
    attendanceOutcomeCode?: string
  } = {}) => {
    return new PreGroupStatusChangePresenter(
      referralDetails,
      backLinkUri,
      isAddToGroupJourney,
      null,
      null,
      attendanceOutcomeCode,
    )
  }

  describe('pageHeading', () => {
    it('shows On programme heading for ATTC (Attended)', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'ATTC' })
      expect(presenter.text.pageHeading).toBe(
        `${referralDetails.personName}'s referral status will change to On programme`,
      )
    })

    it('shows Scheduled heading for AFTC (Attended - did not comply)', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'AFTC' })
      expect(presenter.text.pageHeading).toBe(
        `${referralDetails.personName}'s referral status will change to Scheduled`,
      )
    })

    it('shows Scheduled heading for UAAB (Did not attend)', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'UAAB' })
      expect(presenter.text.pageHeading).toBe(
        `${referralDetails.personName}'s referral status will change to Scheduled`,
      )
    })

    it('shows On programme heading for add-to-group journey', () => {
      const presenter = buildPresenter({ isAddToGroupJourney: true })
      expect(presenter.text.pageHeading).toBe(
        `${referralDetails.personName}'s referral status will change to On programme`,
      )
    })

    it('does not use inverted commas around status text', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'AFTC' })
      // Check that the status text doesn't have inverted commas (allowing for apostrophes in names)
      expect(presenter.text.pageHeading).not.toContain("'Scheduled'")
      expect(presenter.text.pageHeading).not.toContain("'On programme'")
    })
  })

  describe('pageTitle', () => {
    it('shows On programme page title for ATTC', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'ATTC' })
      expect(presenter.pageTitle).toBe('On programme referral status change - Accredited Programmes')
    })

    it('shows Scheduled page title for AFTC', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'AFTC' })
      expect(presenter.pageTitle).toBe('Scheduled referral status change - Accredited Programmes')
    })

    it('shows Scheduled page title for UAAB', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'UAAB' })
      expect(presenter.pageTitle).toBe('Scheduled referral status change - Accredited Programmes')
    })

    it('shows On programme page title for add-to-group journey', () => {
      const presenter = buildPresenter({ isAddToGroupJourney: true })
      expect(presenter.pageTitle).toBe('On programme referral status change - Accredited Programmes')
    })
  })

  describe('backLinkArgs', () => {
    it('returns correct back link', () => {
      const presenter = buildPresenter()
      expect(presenter.backLinkArgs).toEqual({
        text: 'Back',
        href: backLinkUri,
      })
    })
  })

  describe('attendanceCode', () => {
    it('returns the attendance outcome code', () => {
      const presenter = buildPresenter({ attendanceOutcomeCode: 'AFTC' })
      expect(presenter.attendanceCode).toBe('AFTC')
    })

    it('returns undefined when no attendance code provided', () => {
      const presenter = buildPresenter()
      expect(presenter.attendanceCode).toBeUndefined()
    })
  })

  describe('fields', () => {
    it('includes addDetailsTextArea field', () => {
      const presenter = buildPresenter()
      expect(presenter.fields.addDetailsTextArea).toBeDefined()
      expect(presenter.fields.addDetailsTextArea.errorMessage).toBeNull()
      expect(presenter.fields.addDetailsTextArea.value).toBe('')
    })
  })
})
