import CreateOrEditGroupWhenPresenter from './createOrEditGroupWhenPresenter'
import createGroupSessionSlotFactory from '../../testutils/factories/createGroupSessionSlotFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('CreateOrEditGroupWhenPresenter', () => {
  const groupCode = 'TestGroup1'
  const groupId = '123456'

  describe('pageTitle', () => {
    it('returns edit page title when in edit journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData], null, null, groupId)

      expect(presenter.pageTitle).toEqual('Edit group days and times')
    })

    it('returns create page title when in create journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData])

      expect(presenter.pageTitle).toEqual('Group days and times')
    })
  })

  describe('text', () => {
    it('returns edit heading hint text when in edit journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData], null, null, groupId)

      expect(presenter.text.headingHintText).toEqual(`Edit group ${groupCode}`)
    })

    it('returns create heading hint text when in create journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData])

      expect(presenter.text.headingHintText).toEqual(`Create group ${groupCode}`)
    })
  })

  describe('backLinkUri', () => {
    it('returns correct back link when in edit journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData], null, null, groupId)

      expect(presenter.backLinkUri).toEqual(`/group/${groupId}/group-details`)
    })

    it('returns correct back link when in create journey', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [createGroupFormData])

      expect(presenter.backLinkUri).toEqual('/group-start-date')
    })
  })

  describe('whenWillGroupRunCheckBoxArgs', () => {
    it('should return the correct checkbox args', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter('ABC123', [createGroupFormData])

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
