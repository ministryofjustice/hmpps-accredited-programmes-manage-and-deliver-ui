import SentenceInformationPresenter from '../../referralDetails/sentenceInformationPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import sentenceInformationFactory from '../../testutils/factories/sentenceInformationFactory'

describe(`getHorizontalSubNavArgs.`, () => {
  it('the correct tab will be marked as active for a referral details page', () => {
    const referralDetails = referralDetailsFactory.build()
    const sentenceInformation = sentenceInformationFactory.licence().build()

    // Used as an example to test the referral details page, as layout presenter is protected.
    const presenter = new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)

    expect(presenter.getHorizontalSubNavArgs().items).toStrictEqual([
      {
        text: 'Referral details',
        href: `/referral-details/${referralDetails.id}/personal-details`,
        active: true,
      },
      {
        text: 'Risks and needs',
        href: `/referral/${referralDetails.id}/risks-and-alerts`,
        active: false,
      },
      {
        text: 'Programme needs identifier',
        href: `/referral/${referralDetails.id}/programme-needs-identifier`,
        active: false,
      },
      {
        text: 'Status history',
        href: `/referral/${referralDetails.id}/status-history`,
        active: false,
      },
    ])
  })
})
