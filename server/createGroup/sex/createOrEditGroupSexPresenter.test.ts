import { CreateGroupRequest } from '@manage-and-deliver-api'
import CreateOrEditGroupSexPresenter from './createOrEditGroupSexPresenter'

describe('CreateOrEditGroupSexPresenter', () => {
  const groupId = '123456'
  const groupCode = 'TestGroup1'

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('backLinkUri', () => {
    it('returns correct back link when in edit journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, groupId, groupCode)

      expect(presenter.backLinkUri).toEqual('/group/123456/group-details')
    })

    it('returns correct back link when in create journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, undefined)

      expect(presenter.backLinkUri).toEqual('/group/create-a-group/group-cohort')
    })
  })

  describe('captionText', () => {
    it('returns edit caption when in edit journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, groupId, groupCode)

      expect(presenter.captionText).toEqual('Edit group TestGroup1')
    })

    it('returns create caption when in create journey', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'NEW-GROUP-001',
      }
      const presenter = new CreateOrEditGroupSexPresenter(null, createGroupFormData, null, undefined)

      expect(presenter.captionText).toEqual('Create a group NEW-GROUP-001')
    })
  })

  describe('pageTitle', () => {
    it('returns edit page title when in edit journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, groupId, groupCode)

      expect(presenter.pageTitle).toEqual('Edit the gender of the group')
    })

    it('returns create page title when in create journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, undefined)

      expect(presenter.pageTitle).toEqual('Select the gender of the group')
    })
  })

  describe('submitButtonText', () => {
    it('returns Submit when in edit journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, groupId, groupCode)

      expect(presenter.submitButtonText).toEqual('Submit')
    })

    it('returns Continue when in create journey', () => {
      const presenter = new CreateOrEditGroupSexPresenter(null, { groupCode: 'TestGroup1' }, null, undefined)

      expect(presenter.submitButtonText).toEqual('Continue')
    })
  })
})
