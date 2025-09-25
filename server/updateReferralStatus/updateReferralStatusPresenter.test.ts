import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import referralStatusFormDataFactory from '../testutils/factories/referralStatusFormDataFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe(`generateCheckboxItems.`, () => {
  it('should generate items for the data given', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusFormDataFactory.build()
    const presenter = new UpdateReferralStatusPresenter(details, statusDetails, null, null, '')

    expect(presenter.generateStatusUpdateCheckboxes()).toEqual([
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

  it('should generate the checkboxes correctly when re-rendering the page after an error', () => {
    const details = referralDetailsFactory.build()
    const statusDetails = referralStatusFormDataFactory.build()

    const presenter = new UpdateReferralStatusPresenter(details, statusDetails, null, null, '')

    const mockFields = jest.spyOn(presenter, 'fields', 'get')
    mockFields.mockReturnValue({
      moreDetailsTextArea: {
        value: '',
        errorMessage: null,
      },
      updatedStatus: { value: '336b59cd-b467-4305-8547-6a645a8a3f91', errorMessage: 'This is required' },
    })

    expect(presenter.generateStatusUpdateCheckboxes()).toEqual([
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
})
