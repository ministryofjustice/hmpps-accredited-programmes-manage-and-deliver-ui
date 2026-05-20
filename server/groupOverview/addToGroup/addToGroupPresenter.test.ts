import AddToGroupPresenter from './addToGroupPresenter'

describe('AddToGroupPresenter', () => {
  describe('pageTitle', () => {
    it('should return the correct page title', () => {
      const presenter = new AddToGroupPresenter('group-1', {}, '/back')
      expect(presenter.pageTitle).toBe('Add person to group')
    })
  })

  describe('text', () => {
    it('should return correct pageHeading and questionText', () => {
      const presenter = new AddToGroupPresenter('group-1', { groupCode: 'GC1', personName: 'John Doe' }, '/back')
      expect(presenter.text).toEqual({
        pageHeading: 'GC1',
        questionText: 'Add John Doe to this group?',
      })
    })
  })

  describe('backLinkHref', () => {
    it('should return the correct back link', () => {
      const presenter = new AddToGroupPresenter('group-1', {}, '/back-link')
      expect(presenter.backLinkHref).toBe('/back-link')
    })
  })

  describe('errorSummary', () => {
    it('should return null when there is no validation error', () => {
      const presenter = new AddToGroupPresenter('group-1', {}, '/back')
      expect(presenter.errorSummary).toBeNull()
    })
  })

  describe('fields', () => {
    it('should return fields with null errorMessage when there is no validation error', () => {
      const presenter = new AddToGroupPresenter('group-1', {}, '/back')
      expect(presenter.fields).toEqual({
        addToGroup: { errorMessage: null },
      })
    })
  })
})
