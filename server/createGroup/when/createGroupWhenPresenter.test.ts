import CreateGroupWhenPresenter from './createGroupWhenPresenter'
import createGroupSessionSlotFactory from '../../testutils/factories/createGroupSessionSlotFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('groupDetailsPresenter.', () => {
  describe('whenWillGroupRunCheckBoxArgs', () => {
    it('should return the correct checkbox args', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateGroupWhenPresenter('ABC123', [createGroupFormData])

      const result = presenter.whenWillGroupRunCheckBoxArgs
      expect(result[0]).toMatchObject({
        id: 'monday',
        name: 'days-of-week',
        value: 'MONDAY',
        text: 'Mondays',
        checked: true,
        attributes: { 'data-aria-controls': `monday-conditional` },
      })
      expect(result).toHaveLength(7)
    })
  })
})
