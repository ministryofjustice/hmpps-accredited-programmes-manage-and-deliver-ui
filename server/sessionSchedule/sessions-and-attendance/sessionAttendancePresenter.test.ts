import { SessionAttendance } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { FormValidationError } from '../../utils/formValidationError'
import SessionAttendancePresenter from './sessionAttendancePresenter'

describe('SessionAttendancePresenter', () => {
  const groupId = randomUUID()
  const moduleId = randomUUID()
  const groupCode = 'TEST-GROUP-01'
  const mockSessionAttendanceTemplates: SessionAttendance[] = [
    {
      id: randomUUID(),
      name: 'Session attendance type 1',
    },
    {
      id: randomUUID(),
      name: 'Session attendance type 2',
    },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('text', () => {
    it('should return the correct heading hint text with group code', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.text).toEqual({
        headingHintText: groupCode,
      })
    })
  })

  describe('backLinkUri', () => {
    it('should return the correct back link URI', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.backLinkUri).toEqual(`/group/${groupId}/module/${moduleId}/schedule`)
    })
  })

  describe('groupId and moduleId', () => {
    it('should expose groupId as a public property', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.groupId).toEqual(groupId)
    })

    it('should expose moduleId as a public property', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.moduleId).toEqual(moduleId)
    })
  })

  describe('sessionAttendanceTemplates', () => {
    it('should return the available session attendance templates', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.sessionAttendanceTemplates).toEqual(mockSessionAttendanceTemplates)
    })

    it('should return an empty array when no templates are available', () => {
      const presenter = new SessionAttendancePresenter(groupId, moduleId, groupCode, [], null)

      expect(presenter.sessionAttendanceTemplates).toEqual([])
    })
  })

  describe('fields', () => {
    it('should return fields with selected session attendance template ID', () => {
      const selectedTemplateId = mockSessionAttendanceTemplates[0].id
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
        selectedTemplateId,
      )

      expect(presenter.fields).toEqual({
        sessionAttendanceTemplate: {
          value: selectedTemplateId,
          errorMessage: null,
        },
      })
    })

    it('should return fields with undefined value when no template is selected', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.fields).toEqual({
        sessionAttendanceTemplate: {
          value: undefined,
          errorMessage: null,
        },
      })
    })

    it('should return error message when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['session-attendance-template'],
            errorSummaryLinkedField: 'session-attendance-template',
            message: 'Select a session type',
          },
        ],
      }

      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        validationError,
      )

      expect(presenter.fields.sessionAttendanceTemplate.errorMessage).toEqual('Select a session type')
    })
  })

  describe('errorSummary', () => {
    it('should return error summary when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['session-attendance-template'],
            errorSummaryLinkedField: 'session-attendance-template',
            message: 'Select a session type',
          },
        ],
      }

      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([
        { field: 'session-attendance-template', message: 'Select a session type' },
      ])
    })

    it('should return null when no validation error exists', () => {
      const presenter = new SessionAttendancePresenter(
        groupId,
        moduleId,
        groupCode,
        mockSessionAttendanceTemplates,
        null,
      )

      expect(presenter.errorSummary).toBeNull()
    })
  })
})
