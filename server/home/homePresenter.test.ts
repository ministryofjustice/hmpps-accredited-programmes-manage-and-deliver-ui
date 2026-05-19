import HomePresenter from './homePresenter'

describe('HomePresenter', () => {
  describe('text', () => {
    it('returns the correct page heading and caption', () => {
      const presenter = new HomePresenter()

      expect(presenter.text).toEqual({
        pageHeading: 'Accredited Programmes',
        headingCaption: '',
      })
    })

    it('has the expected pageHeading', () => {
      const presenter = new HomePresenter()

      expect(presenter.text.pageHeading).toEqual('Accredited Programmes')
    })

    it('has an empty headingCaption', () => {
      const presenter = new HomePresenter()

      expect(presenter.text.headingCaption).toEqual('')
    })
  })
})
