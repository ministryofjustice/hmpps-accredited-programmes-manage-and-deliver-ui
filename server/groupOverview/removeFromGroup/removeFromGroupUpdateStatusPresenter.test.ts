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
})
