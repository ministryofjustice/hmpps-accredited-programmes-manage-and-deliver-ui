import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import CreateOrEditGroupPduPresenter from './createOrEditGroupPduPresenter'

describe('CreateOrEditGroupPduPresenter', () => {
  const groupId = 'group-123'
  const mockLocations: CodeDescription[] = [
    { code: 'PDU-NW', description: 'North West' },
    { code: 'PDU-NE', description: 'North East' },
    { code: 'PDU-SW', description: 'South West' },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('backLinkUri', () => {
    it('returns group details link when isEdit is true', () => {
      const presenter = new CreateOrEditGroupPduPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        groupId,
        true,
      )

      expect(presenter.backLinkUri).toEqual('/group/group-123/group-details')
    })

    it('returns create group sex link when isEdit is false', () => {
      const presenter = new CreateOrEditGroupPduPresenter(
        mockLocations,
        null,
        { groupCode: 'TEST-GROUP-001' },
        null,
        null,
        false,
      )

      expect(presenter.backLinkUri).toEqual('/group/create-a-group/group-sex')
    })
  })

  describe('text', () => {
    describe('when isEdit is true', () => {
      it('returns edit mode heading text', () => {
        const createGroupFormData: Partial<CreateGroupRequest> = {
          groupCode: 'TEST-GROUP-001',
        }
        const presenter = new CreateOrEditGroupPduPresenter(
          mockLocations,
          null,
          createGroupFormData,
          null,
          groupId,
          true,
        )

        expect(presenter.text).toEqual({
          headingHintText: 'Edit group TEST-GROUP-001',
          headingText: 'Edit the probation delivery unit (PDU) where the group will take place',
        })
      })
    })

    describe('when isEdit is false', () => {
      it('returns create mode heading text', () => {
        const createGroupFormData: Partial<CreateGroupRequest> = {
          groupCode: 'NEW-GROUP-001',
        }
        const presenter = new CreateOrEditGroupPduPresenter(mockLocations, null, createGroupFormData, null, null, false)

        expect(presenter.text).toEqual({
          headingHintText: 'Create group NEW-GROUP-001',
          headingText: 'In which probation delivery unit (PDU) will the group take place?',
        })
      })
    })
  })

  describe('generateSelectOptions', () => {
    it('generates select options from locations with no selection', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }

      const presenter = new CreateOrEditGroupPduPresenter(mockLocations, null, createGroupFormData, null, groupId, true)

      const result = presenter.generateSelectOptions()

      expect(result[1]).toEqual({
        text: 'North West',
        value: '{"code":"PDU-NW", "name":"North West"}',
        selected: false,
      })
      expect(result[2]).toEqual({
        text: 'North East',
        value: '{"code":"PDU-NE", "name":"North East"}',
        selected: false,
      })
      expect(result[3]).toEqual({
        text: 'South West',
        value: '{"code":"PDU-SW", "name":"South West"}',
        selected: false,
      })
    })

    it('generates select options with selected PDU from form data', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
        pduCode: 'PDU-NE',
      }

      const presenter = new CreateOrEditGroupPduPresenter(mockLocations, null, createGroupFormData, null, groupId, true)

      const result = presenter.generateSelectOptions()

      expect(result[1].selected).toBe(false)
      expect(result[2].selected).toBe(true) // PDU-NE is selected
      expect(result[3].selected).toBe(false)
    })

    it('generates select options with selected PDU from user input', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TEST-GROUP-001',
      }
      const userInputData = {
        pduCode: 'PDU-SW',
      }

      const presenter = new CreateOrEditGroupPduPresenter(
        mockLocations,
        null,
        createGroupFormData,
        userInputData,
        groupId,
        true,
      )

      const result = presenter.generateSelectOptions()

      expect(result[1].selected).toBe(false)
      expect(result[2].selected).toBe(false)
      expect(result[3].selected).toBe(true) // PDU-SW is selected from user input
    })
  })
})
