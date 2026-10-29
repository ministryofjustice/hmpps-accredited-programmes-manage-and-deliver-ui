import PersonalDetailsPresenter from './personalDetailsPresenter'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import PersonalDetailsView from './personalDetailsView'

describe('PersonalDetailsPresenter', () => {
  it('renders the summary CRN as individual characters for screen readers', () => {
    const presenter = new PersonalDetailsPresenter(
      referralDetailsFactory.build(),
      'personal-details',
      personalDetailsFactory.build({ crn: 'S276739' }),
    )

    const { summary } = new PersonalDetailsView(presenter)
    expect(summary.rows.find(row => row.key.text === 'CRN').value.html).toBe(
      '<span aria-hidden="true">S276739</span><span class="govuk-visually-hidden">S 2 7 6 7 3 9</span>',
    )
  })

  describe('headingText', () => {
    it('returns the referral details heading for the referral person', () => {
      const referralDetails = referralDetailsFactory.build({ personName: 'Alex River' })
      const personalDetails = personalDetailsFactory.build()
      const presenter = new PersonalDetailsPresenter(referralDetails, 'personal-details', personalDetails)

      expect(presenter.headingText).toBe(`Referral details: ${referralDetails.personName}`)
    })
  })

  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const referralDetails = referralDetailsFactory.build()
      const personalDetails = personalDetailsFactory.build()
      const presenter = new PersonalDetailsPresenter(referralDetails, 'personal-details', personalDetails)

      expect(presenter.pageTitle).toBe('Personal details - Referral details')
    })
  })
})
