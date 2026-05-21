import AddToGroupMoreDetailsPresenter from './addToGroupMoreDetailsPresenter'

describe('AddToGroupMoreDetailsPresenter', () => {
  const groupId = 'group-1'
  const groupManagementData = { personName: 'Alex River', groupCode: 'GC1' }
  const backLink = '/back-link'

  it('should return the correct page title', () => {
    const presenter = new AddToGroupMoreDetailsPresenter(groupId, groupManagementData, backLink)
    expect(presenter.pageTitle).toBe('Change status to scheduled')
  })

  it('should return the correct text object', () => {
    const presenter = new AddToGroupMoreDetailsPresenter(groupId, groupManagementData, backLink)
    expect(presenter.text).toEqual({
      pageHeading: "Alex River's referral status will change to Scheduled",
    })
  })

  it('should return correct backLinkHref', () => {
    const presenter = new AddToGroupMoreDetailsPresenter(groupId, groupManagementData, backLink)
    expect(presenter.backLinkHref).toBe('/back-link')
  })
})
