import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import CreateOrEditGroupCodePresenter from './createOrEditGroupCodePresenter'

describe('CreateOrEditGroupCodePresenter', () => {
  const groupId = '123456'
  const groupCode = 'TEST-001'

  describe('backLinkUri', () => {
    it('returns correct back link when in edit journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, groupId, groupCode)

      expect(presenter.backLinkUri).toEqual('/group/123456/group-details')
    })

    it('returns correct back link when in create journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, undefined)

      expect(presenter.backLinkUri).toEqual('/create-group')
    })
  })

  describe('captionText', () => {
    it('returns edit caption when in edit journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, groupId, groupCode)

      expect(presenter.captionText).toEqual('Edit group TEST-001')
    })

    it('returns create caption when in create journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, undefined)

      expect(presenter.captionText).toEqual('Create a group')
    })
  })

  describe('pageTitle', () => {
    it('returns edit page title when in edit journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, groupId, groupCode)

      expect(presenter.pageTitle).toEqual('Edit group code')
    })

    it('returns create page title when in create journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, undefined)

      expect(presenter.pageTitle).toEqual('Create group code')
    })
  })

  describe('submitButtonText', () => {
    it('returns Submit when in edit journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, groupId, groupCode)

      expect(presenter.submitButtonText).toEqual('Submit')
    })

    it('returns Continue when in create journey', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, undefined)

      expect(presenter.submitButtonText).toEqual('Continue')
    })
  })

  describe('errorSummary', () => {
    it('returns null when there is no validation error', () => {
      const presenter = new CreateOrEditGroupCodePresenter(null, null, null, undefined)

      expect(presenter.errorSummary).toEqual(null)
    })

    it('returns error summary when there is a validation error', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            errorSummaryLinkedField: 'create-group-code',
            formFields: ['create-group-code'],
            message: 'Code is required',
          },
        ],
      }

      const presenter = new CreateOrEditGroupCodePresenter(validationError, null, null, undefined)

      expect(presenter.errorSummary).toBeDefined()
    })
  })

  describe('fields', () => {
    it('returns field with value from createGroupFormData', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'GROUP-123',
      }

      const presenter = new CreateOrEditGroupCodePresenter(null, createGroupFormData, null, undefined)

      expect(presenter.fields.createGroupCode.value).toEqual('GROUP-123')
    })

    it('returns field with null error message when validation passes', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'GROUP-123',
      }

      const presenter = new CreateOrEditGroupCodePresenter(null, createGroupFormData, null, undefined)

      expect(presenter.fields.createGroupCode.errorMessage).toBeNull()
    })
  })
})
