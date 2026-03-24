import PersonalDetailsPresenter from './personalDetailsPresenter'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'

describe('PersonalDetailsPresenter', () => {
  describe('headingText', () => {
    it('returns the referral details heading for the referral person', () => {
      const referralDetails = referralDetailsFactory.build({ personName: 'Alex River' })
      const personalDetails = personalDetailsFactory.build()
      const presenter = new PersonalDetailsPresenter(referralDetails, 'personal-details', personalDetails)

      expect(presenter.headingText).toBe(`Referral details: ${referralDetails.personName}`)
    })
  })
})
