import CreateGroupStartPresenter from './createGroupStartPresenter'

describe('CreateGroupStartPresenter', () => {
  describe('backLinkUri', () => {
    it('returns the correct backlink URI', () => {
      const presenter = new CreateGroupStartPresenter()

      expect(presenter.backLinkUri).toEqual('/groups/not-started-and-in-progress')
    })
  })

  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const presenter = new CreateGroupStartPresenter()

      expect(presenter.pageTitle).toEqual('Create group')
    })
  })
})
