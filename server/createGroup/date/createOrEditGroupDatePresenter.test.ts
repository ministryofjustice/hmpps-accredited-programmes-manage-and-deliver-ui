import { CreateGroupRequest } from '@manage-and-deliver-api'
import CreateOrEditGroupDatePresenter from './createOrEditGroupDatePresenter'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

jest.mock('../../utils/presenterUtils')

describe('CreateOrEditGroupDatePresenter', () => {
  const groupId = '123456'

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('backLinkUri', () => {
    it('returns correct back link when in edit journey', () => {
      const presenter = new CreateOrEditGroupDatePresenter(null, { groupCode: 'TestGroup1' }, groupId)

      expect(presenter.backLinkUri).toEqual('/group/123456/group-details')
    })

    it('returns correct back link when in create journey', () => {
      const presenter = new CreateOrEditGroupDatePresenter(null, { groupCode: 'TestGroup1' }, null)

      expect(presenter.backLinkUri).toEqual('/create-group-code')
    })
  })

  describe('text', () => {
    it('returns edit heading hint text when in edit journey', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TestGroup1',
      }
      const presenter = new CreateOrEditGroupDatePresenter(null, createGroupFormData, groupId)

      expect(presenter.text.headingHintText).toEqual('Edit group TestGroup1')
    })

    it('returns create heading hint text when in create journey', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'NEW-GROUP-001',
      }
      const presenter = new CreateOrEditGroupDatePresenter(null, createGroupFormData, null)

      expect(presenter.text.headingHintText).toEqual('Create group NEW-GROUP-001')
    })
  })

  describe('pageTitle', () => {
    it('returns edit page title when in edit journey', () => {
      const presenter = new CreateOrEditGroupDatePresenter(null, { groupCode: 'TestGroup1' }, groupId)

      expect(presenter.pageTitle).toEqual('Edit group start date')
    })

    it('returns create page title when in create journey', () => {
      const presenter = new CreateOrEditGroupDatePresenter(null, { groupCode: 'TestGroup1' }, null)

      expect(presenter.pageTitle).toEqual('Add group start date')
    })
  })

  describe('errorSummary', () => {
    it('returns error summary from PresenterUtils when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['create-group-date'],
            errorSummaryLinkedField: 'create-group-date',
            message: 'Date is required',
          },
        ],
      }
      const mockErrorSummary = [{ text: 'Date is required', href: '#create-group-date' }]
      ;(PresenterUtils.errorSummary as jest.Mock).mockReturnValue(mockErrorSummary)

      const presenter = new CreateOrEditGroupDatePresenter(validationError, { groupCode: 'TestGroup1' }, null)

      expect(presenter.errorSummary).toEqual(mockErrorSummary)
      expect(PresenterUtils.errorSummary).toHaveBeenCalledWith(validationError)
    })

    it('returns error summary from PresenterUtils when no validation error', () => {
      const mockErrorSummary: never[] = []
      ;(PresenterUtils.errorSummary as jest.Mock).mockReturnValue(mockErrorSummary)

      const presenter = new CreateOrEditGroupDatePresenter(null, { groupCode: 'TestGroup1' }, null)

      expect(presenter.errorSummary).toEqual(mockErrorSummary)
      expect(PresenterUtils.errorSummary).toHaveBeenCalledWith(null)
    })
  })

  describe('fields', () => {
    it('returns fields with form data when data is present', () => {
      const mockErrorMessage = 'Date format is invalid'
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['create-group-date'],
            errorSummaryLinkedField: 'create-group-date',
            message: 'Date format is invalid',
          },
        ],
      }
      ;(PresenterUtils.errorMessage as jest.Mock).mockReturnValue(mockErrorMessage)

      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TestGroup1',
        earliestStartDate: '2025-12-01',
      }
      const presenter = new CreateOrEditGroupDatePresenter(validationError, createGroupFormData, null)

      expect(presenter.fields.createGroupDate.value).toEqual('2025-12-01')
      expect(presenter.fields.createGroupDate.errorMessage).toEqual(mockErrorMessage)
      expect(PresenterUtils.errorMessage).toHaveBeenCalledWith(validationError, 'create-group-date')
    })

    it('returns fields without error message when no validation error', () => {
      ;(PresenterUtils.errorMessage as jest.Mock).mockReturnValue(null)

      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'TestGroup1',
        earliestStartDate: '2025-12-01',
      }
      const presenter = new CreateOrEditGroupDatePresenter(null, createGroupFormData, null)

      expect(presenter.fields.createGroupDate.value).toEqual('2025-12-01')
      expect(presenter.fields.createGroupDate.errorMessage).toBeNull()
      expect(PresenterUtils.errorMessage).toHaveBeenCalledWith(null, 'create-group-date')
    })

    it('returns fields with undefined value when no form data', () => {
      ;(PresenterUtils.errorMessage as jest.Mock).mockReturnValue(null)

      const presenter = new CreateOrEditGroupDatePresenter(null, null, null)

      expect(presenter.fields.createGroupDate.value).toBeUndefined()
      expect(presenter.fields.createGroupDate.errorMessage).toBeNull()
    })
  })
})
