import { SessionSchedule } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { FormValidationError } from '../../utils/formValidationError'
import SessionScheduleWhichPresenter from './sessionScheduleWhichPresenter'

describe('SessionScheduleWhichPresenter', () => {
  const groupId = randomUUID()
  const moduleId = randomUUID()
  const mockSessionTemplates: SessionSchedule[] = [
    {
      id: randomUUID(),
      number: 1,
      name: 'Getting started one-to-one',
    },
    {
      id: randomUUID(),
      number: 2,
      name: 'Session 2',
    },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('text', () => {
    it('should return the correct heading hint text with session name', () => {
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
      )

      expect(presenter.text).toEqual({
        headingHintText: 'GRP1 - Module A',
        headingCaptionText: 'Schedule a Module A session',
      })
    })

    it('should return fallback text when session name is generic', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, moduleId, '', '', [], null)

      expect(presenter.text).toEqual({
        headingHintText: 'the session',
        headingCaptionText: 'Schedule a the session',
      })
    })
  })

  describe('backLinkUri', () => {
    it('should return the correct back link URI when group code is provided', () => {
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
      )

      expect(presenter.backLinkUri).toEqual('/group/GRP1/sessions-and-attendance')
    })

    it('should fall back to the group id when no group code is provided', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, moduleId, '', 'Module A', mockSessionTemplates, null)

      expect(presenter.backLinkUri).toEqual(`/group/${groupId}/sessions-and-attendance`)
    })
  })

  describe('sessionTemplates', () => {
    it('should return the available session templates', () => {
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
      )

      expect(presenter.sessionTemplates).toEqual(mockSessionTemplates)
    })

    it('should return an empty array when no templates are available', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, moduleId, 'GRP1', '', [], null)

      expect(presenter.sessionTemplates).toEqual([])
    })
  })

  describe('fields', () => {
    it('should return fields with selected session template ID', () => {
      const selectedTemplateId = mockSessionTemplates[0].id
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
        selectedTemplateId,
      )

      expect(presenter.fields).toEqual({
        sessionTemplate: {
          value: selectedTemplateId,
          errorMessage: null,
        },
      })
    })

    it('should return fields with undefined value when no template is selected', () => {
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
      )

      expect(presenter.fields).toEqual({
        sessionTemplate: {
          value: undefined,
          errorMessage: null,
        },
      })
    })

    it('should return error message when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['session-template'],
            errorSummaryLinkedField: 'session-template',
            message: 'Select a session',
          },
        ],
      }

      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        validationError,
      )

      expect(presenter.fields.sessionTemplate.errorMessage).toEqual('Select a session')
    })
  })

  describe('errorSummary', () => {
    it('should return error summary when validation error exists', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['session-template'],
            errorSummaryLinkedField: 'session-template',
            message: 'Select a session',
          },
        ],
      }

      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([{ field: 'session-template', message: 'Select a session' }])
    })

    it('should return null when no validation error exists', () => {
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        moduleId,
        'GRP1',
        'Module A',
        mockSessionTemplates,
        null,
      )

      expect(presenter.errorSummary).toBeNull()
    })
  })
})
