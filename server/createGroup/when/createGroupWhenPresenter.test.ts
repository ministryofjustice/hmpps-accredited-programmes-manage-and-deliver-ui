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

    it('associates start-time hint with hour, minute and am or pm controls', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const presenter = new CreateOrEditGroupWhenPresenter('ABC123', [createGroupFormData])

      const conditionalHtml = presenter.whenWillGroupRunCheckBoxArgs[0].conditional.html

      expect(conditionalHtml).toContain('id="monday-time-hint"')
      expect(conditionalHtml).toContain('id="monday-hour" name="monday-hour" type="text"')
      expect(conditionalHtml).toContain('aria-describedby="monday-time-hint"')
      expect(conditionalHtml).toContain('id="monday-minute" name="monday-minute" type="text"')
      expect(conditionalHtml).toContain('id="monday-ampm" name="monday-ampm"')
    })

    it('includes field-level errors in aria-describedby for relevant controls', () => {
      const createGroupFormData = createGroupSessionSlotFactory.build()
      const validationError = {
        errors: [{ formFields: ['monday-hour'], errorSummaryLinkedField: 'monday-hour', message: 'Enter an hour' }],
      }
      const presenter = new CreateOrEditGroupWhenPresenter('ABC123', [createGroupFormData], validationError)

      const conditionalHtml = presenter.whenWillGroupRunCheckBoxArgs[0].conditional.html

      expect(conditionalHtml).toContain('aria-describedby="monday-time-hint monday-hour-error"')
      expect(conditionalHtml).toContain('aria-describedby="monday-time-hint"')
      expect(conditionalHtml).toContain('id="monday-hour-error"')
    })
  })

  describe('errorSummary', () => {
    it('returns null when there is no validation error', () => {
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [])

      expect(presenter.errorSummary).toBeNull()
    })

    it('remaps days-of-week error to the monday checkbox id', () => {
      const validationError = {
        errors: [
          {
            errorSummaryLinkedField: 'days-of-week',
            formFields: ['days-of-week'],
            message: 'Select at least one day',
          },
        ],
      }
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [], validationError)

      expect(presenter.errorSummary).toEqual([{ field: 'monday', message: 'Select at least one day' }])
    })

    it('preserves time-slot field errors unchanged', () => {
      const validationError = {
        errors: [
          {
            errorSummaryLinkedField: 'monday-hour',
            formFields: ['monday-hour'],
            message: 'Enter a complete start time for Monday',
          },
          {
            errorSummaryLinkedField: 'monday-ampm',
            formFields: ['monday-ampm'],
            message: 'Select whether the start time is am or pm for Monday',
          },
        ],
      }
      const presenter = new CreateOrEditGroupWhenPresenter(groupCode, [], validationError)

      expect(presenter.errorSummary).toEqual([
        { field: 'monday-hour', message: 'Enter a complete start time for Monday' },
        { field: 'monday-ampm', message: 'Select whether the start time is am or pm for Monday' },
      ])
    })
  })
})
