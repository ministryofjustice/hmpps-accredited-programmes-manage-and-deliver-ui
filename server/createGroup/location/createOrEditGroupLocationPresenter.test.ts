import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import CreateOrEditGroupLocationPresenter from './createOrEditGroupLocationPresenter'

describe('CreateOrEditGroupLocationPresenter', () => {
  const groupId = 'group-123'
  const mockLocations: CodeDescription[] = [
    { code: 'LOC-1', description: 'HMP Leeds' },
    { code: 'LOC-2', description: 'HMP Manchester' },
    { code: 'LOC-3', description: 'HMP Birmingham' },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('backLinkUri', () => {
    it('returns group details link when isEdit is true', () => {
      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        groupId,
        true,
        '/group/group-123/edit-group-probation-delivery-unit',
      )

      expect(presenter.backLinkUri).toEqual('/group/group-123/edit-group-probation-delivery-unit')
    })

    it('returns create group PDU link when isEdit is false', () => {
      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        null,
        false,
      )

      expect(presenter.backLinkUri).toEqual('/group/create-a-group/group-probation-delivery-unit')
    })
  })

  describe('changeLinkUri', () => {
    it('returns edit group PDU link when isEdit is true', () => {
      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        groupId,
        true,
      )

      expect(presenter.changeLinkUri).toEqual('/group/group-123/edit-group-probation-delivery-unit')
    })

    it('returns create group PDU link when isEdit is false', () => {
      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        null,
        false,
      )

      expect(presenter.changeLinkUri).toEqual('/group/create-a-group/group-probation-delivery-unit')
    })
  })

  describe('text', () => {
    describe('when isEdit is true', () => {
      it('returns edit mode heading text', () => {
        const createGroupFormData: Partial<CreateGroupRequest> = {
          groupCode: 'TEST-GROUP-001',
        }
        const presenter = new CreateOrEditGroupLocationPresenter(
          mockLocations,
          null,
          createGroupFormData,
          null,
          groupId,
          true,
        )

        expect(presenter.text).toEqual({
          headingHintText: 'Edit group TEST-GROUP-001',
          subHeadingText: 'Edit where the group will take place',
        })
      })
    })

    describe('when isEdit is false', () => {
      it('returns create mode heading text', () => {
        const createGroupFormData: Partial<CreateGroupRequest> = {
          groupCode: 'NEW-GROUP-001',
        }
        const presenter = new CreateOrEditGroupLocationPresenter(
          mockLocations,
          null,
          createGroupFormData,
          null,
          null,
          false,
        )

        expect(presenter.text).toEqual({
          headingHintText: 'Create group NEW-GROUP-001',
          subHeadingText: 'Where will the group take place?',
        })
      })
    })
  })

  describe('generateRadioOptions', () => {
    it('generates radio options from locations with no selection', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }

      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        createGroupFormData,
        null,
        groupId,
        true,
      )

      const result = presenter.generateRadioOptions()

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        text: 'HMP Leeds',
        value: '{"code":"LOC-1", "name":"HMP Leeds"}',
        checked: false,
      })
      expect(result[1]).toEqual({
        text: 'HMP Manchester',
        value: '{"code":"LOC-2", "name":"HMP Manchester"}',
        checked: false,
      })
      expect(result[2]).toEqual({
        text: 'HMP Birmingham',
        value: '{"code":"LOC-3", "name":"HMP Birmingham"}',
        checked: false,
      })
    })

    it('generates radio options with selected location from form data', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
        deliveryLocationCode: 'LOC-2',
      }

      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        createGroupFormData,
        null,
        groupId,
        true,
      )

      const result = presenter.generateRadioOptions()

      expect(result).toHaveLength(3)
      expect(result[0].checked).toBe(false)
      expect(result[1].checked).toBe(true) // LOC-2 is selected
      expect(result[2].checked).toBe(false)
    })

    it('generates radio options with selected location from user input', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }
      const userInputData = {
        deliveryLocationCode: 'LOC-3',
      }

      const presenter = new CreateOrEditGroupLocationPresenter(
        mockLocations,
        null,
        createGroupFormData,
        userInputData,
        groupId,
        true,
      )

      const result = presenter.generateRadioOptions()

      expect(result).toHaveLength(3)
      expect(result[0].checked).toBe(false)
      expect(result[1].checked).toBe(false)
      expect(result[2].checked).toBe(true) // LOC-3 is selected from user input
    })
  })
})
