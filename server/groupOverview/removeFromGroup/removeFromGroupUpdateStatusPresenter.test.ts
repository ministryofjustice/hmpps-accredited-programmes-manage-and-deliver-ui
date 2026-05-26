import RemoveFromGroupUpdateStatusPresenter from './removeFromGroupUpdateStatusPresenter'
import referralStatusTransitionsFactory from '../../testutils/factories/referralStatusTransitionsFactory'

describe('RemoveFromGroupUpdateStatusPresenter', () => {
  const groupId = 'group-1'
  const statusDetails = referralStatusTransitionsFactory.build()
  const backLinkUri = '/back-link'
  const groupManagementData = { personName: 'Archibald Queeny' }

  it('should return the correct page title', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    expect(presenter.pageTitle).toBe('Update status: remove person from group')
  })

  it('should return correct pageHeading in text', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    expect(presenter.text).toEqual({
      pageHeading: `Update Archibald Queeny's referral status`,
    })
  })

  it('should return correct cancelLinkHref', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    expect(presenter.cancelLinkHref).toBe('/group/group-1/waitlist')
  })

  it('should return null errorSummary when no validation error', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    expect(presenter.errorSummary).toBeNull()
  })

  it('should return fields with null errorMessages and empty values', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    expect(presenter.fields).toEqual({
      moreDetailsTextArea: { errorMessage: null, value: '' },
      updatedStatus: { errorMessage: null, value: '' },
    })
  })

  it('should generate status radios from available statuses', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)

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
      {
        checked: false,
        hint: {
          text: 'The person has been recalled. Depending on the recall type, the referral may be withdrawn or returned to awaiting assessment.',
        },
        text: 'Recall',
        value: 'aec91cd3-fba0-40a4-a5c6-7578b596af75',
      },
      {
        checked: false,
        hint: {
          text: 'The person is not suitable for the programme or cannot continue with it. The referral will be returned to court.',
        },
        text: 'Return to court',
        value: 'e9fb9e3a-147b-4f26-aa0c-d852db4b7fef',
      },
    ])
  })

  it('should hide the Deprioritised option', () => {
    const presenter = new RemoveFromGroupUpdateStatusPresenter(groupId, statusDetails, backLinkUri, groupManagementData)
    const radios = presenter.generateStatusUpdateRadios()

    expect(radios.find(radio => radio.text === 'Deprioritised')).toBeUndefined()
  })
})
