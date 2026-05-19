import SentenceInformationPresenter from '../../referralDetails/sentenceInformationPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import sentenceInformationFactory from '../../testutils/factories/sentenceInformationFactory'

const buildPresenter = (currentStatusDescription = 'Awaiting assessment') => {
  const referralDetails = referralDetailsFactory.build({ currentStatusDescription })
  const sentenceInformation = sentenceInformationFactory.licence().build()

  return new SentenceInformationPresenter(referralDetails, 'sentence-information', sentenceInformation)
}

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
        href: `/referral/${referralDetails.id}/risks-and-needs/risks-and-alerts`,
        active: false,
      },
      {
        text: 'Programme needs identifier',
        href: `/referral/${referralDetails.id}/programme-needs-identifier`,
        active: false,
      },
      {
        text: 'Availability and motivation',
        href: `/referral/${referralDetails.id}/availability-and-motivation/availability`,
        active: false,
      },
      {
        text: 'Attendance history',
        href: `/referral/${referralDetails.id}/attendance-history`,
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

describe('getButtonMenu', () => {
  it('returns default update status URL and change links for LDC and cohort', () => {
    const presenter = buildPresenter()

    expect(presenter.getButtonMenu()).toStrictEqual({
      button: {
        text: 'Update referral',
        classes: 'govuk-button--secondary',
      },
      items: [
        {
          text: 'Update status',
          href: `/referral/${presenter.details.id}/update-status`,
        },
        {
          text: 'Change LDC status',
          href: `/referral/${presenter.details.id}/update-learning-disabilities-and-challenges`,
        },
        {
          text: 'Change cohort',
          href: `/referral/${presenter.details.id}/change-cohort`,
        },
      ],
    })
  })

  it('returns scheduled update status URL when current status is Scheduled', () => {
    const presenter = buildPresenter('Scheduled')

    expect(presenter.getButtonMenu().items[0]).toStrictEqual({
      text: 'Update status',
      href: `/referral/${presenter.details.id}/update-status-scheduled`,
    })
  })

  it('returns on programme update status URL when current status is On programme', () => {
    const presenter = buildPresenter('On programme')

    expect(presenter.getButtonMenu().items[0]).toStrictEqual({
      text: 'Update status',
      href: `/referral/${presenter.details.id}/update-status-on-programme`,
    })
  })
})

describe('pageTitle', () => {
  it('returns the expected page title for sentence information', () => {
    const presenter = buildPresenter()

    expect(presenter.pageTitle).toEqual('Sentence information - Referral details')
  })
})
