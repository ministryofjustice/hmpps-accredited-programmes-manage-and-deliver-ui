import RemoveFromGroupPresenter from './removeFromGroupPresenter'

describe('RemoveFromGroupPresenter', () => {
  const groupId = 'group-1'
  const groupManagementData = { personName: 'Alex River', groupCode: 'GC1' }
  const backLink = '/back-link'

  it('should return the correct page title', () => {
    const presenter = new RemoveFromGroupPresenter(groupId, groupManagementData, backLink)
    expect(presenter.pageTitle).toBe('Remove person from group')
  })

  it('should return correct text object', () => {
    const presenter = new RemoveFromGroupPresenter(groupId, groupManagementData, backLink)
    expect(presenter.text).toEqual({
      pageHeading: 'GC1',
      questionText: 'Remove Alex River from this group?',
    })
  })

  it('should return correct backLinkHref', () => {
    const presenter = new RemoveFromGroupPresenter(groupId, groupManagementData, backLink)
    expect(presenter.backLinkHref).toBe('/back-link')
  })

  it('should return correct cancelLinkHref', () => {
    const presenter = new RemoveFromGroupPresenter(groupId, groupManagementData, backLink)
    expect(presenter.cancelLinkHref).toBe('/group/group-1/waitlist')
  })
})
