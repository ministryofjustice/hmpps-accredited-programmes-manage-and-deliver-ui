import CreateGroupStartPresenter from './createGroupStartPresenter'

describe('CreateGroupStartPresenter', () => {
  describe('backLinkUri', () => {
    it('returns the correct backlink URI', () => {
      const presenter = new CreateGroupStartPresenter()

      expect(presenter.backLinkUri).toEqual('/groups/not-started-and-in-progress')
    })
  })
})
