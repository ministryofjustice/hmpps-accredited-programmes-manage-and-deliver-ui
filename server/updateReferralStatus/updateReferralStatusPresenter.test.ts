import { fakerEN_GB as faker } from '@faker-js/faker'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import referralStatusFormDataFactory from '../testutils/factories/referralStatusFormDataFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('generateStatusUpdateRadios.', () => {
  it('should generate items for the data given', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusFormDataFactory.build()

    const presenter = new UpdateReferralStatusPresenter(
      details,
      statusDetails,
      '', // backLinkUri
    )

    expect(presenter.generateStatusUpdateRadios()).toEqual([
      {
        checked: false,
        hint: {
          text: 'The person has been assessed as suitable and can be allocated to a group.',
        },
        text: 'Awaiting allocation',
        value: 'bb1e8c72-cf52-4297-94a4-3745c2a25178',
      },
      {
        checked: false,
        hint: {
          text: 'The person meets the suitability criteria but is not ready to start the programme. The referral will be paused until they are ready.',
        },
        text: 'Suitable but not ready',
        value: '336b59cd-b467-4305-8547-6a645a8a3f91',
      },
    ])
  })

  it('should generate the radios correctly when re-rendering the page after an error', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusFormDataFactory.build()
    const moreDetails = faker.string.alphanumeric(501)

    const presenter = new UpdateReferralStatusPresenter(
      details,
      statusDetails,
      '', // backLinkUri
    )

    const mockFields = jest.spyOn(presenter, 'fields', 'get')
    mockFields.mockReturnValue({
      moreDetailsTextArea: {
        value: moreDetails,
        errorMessage: 'Details must be 500 characters or fewer.',
      },
      updatedStatus: { value: '336b59cd-b467-4305-8547-6a645a8a3f91', errorMessage: null },
    })

    expect(presenter.generateStatusUpdateRadios()).toEqual([
      {
        checked: false,
        hint: {
          text: 'The person has been assessed as suitable and can be allocated to a group.',
        },
        text: 'Awaiting allocation',
        value: 'bb1e8c72-cf52-4297-94a4-3745c2a25178',
      },
      {
        checked: true,
        hint: {
          text: 'The person meets the suitability criteria but is not ready to start the programme. The referral will be paused until they are ready.',
        },
        text: 'Suitable but not ready',
        value: '336b59cd-b467-4305-8547-6a645a8a3f91',
      },
    ])
  })
  describe('generateAddDetailsHintText', () => {
    it('returns the correct hint for Awaiting allocation', () => {
      const details = referralDetailsFactory.build()
      const statusDetails = referralStatusFormDataFactory.build({ currentStatus: { title: 'Awaiting allocation' } })
      const presenter = new UpdateReferralStatusPresenter(details, statusDetails, '')
      expect(presenter.generateAddDetailsHintText()).toBe(
        'You can add more information about this update, such as the reason for deprioritising someone.',
      )
    })

    it('returns the default hint for other statuses', () => {
      const details = referralDetailsFactory.build()
      const statusDetails = referralStatusFormDataFactory.build()
      const presenter = new UpdateReferralStatusPresenter(details, statusDetails, '')
      expect(presenter.generateAddDetailsHintText()).toBe(
        'You can add more information about this update, such as the reason for an assessment decision or for deprioritising someone.',
      )
    })
  })
})
