import { ScheduleSessionTypeResponse } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { FormValidationError } from '../../utils/formValidationError'
import SessionScheduleWhichPresenter from './sessionScheduleWhichPresenter'

describe('SessionScheduleWhichPresenter', () => {
  const groupId = randomUUID()
  const mockScheduleSessionTypeResponse: ScheduleSessionTypeResponse = {
    pageHeading: 'Schedule a Getting started one-to-one',
    sessionTemplates: [
      {
        id: randomUUID(),
        number: 1,
        name: 'Getting started one-to-one',
        sessionScheduleType: 'SCHEDULED',
      },
      {
        id: randomUUID(),
        number: 2,
        name: 'Session 2',
        sessionScheduleType: 'CATCH_UP',
      },
    ],
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('text', () => {
    it('should return the correct heading hint text with session name', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, null)

      expect(presenter.text).toEqual({
        headingHintText: 'Schedule a Getting started one-to-one',
      })
    })
  })

  describe('backLinkUri', () => {
    it('should return the correct back link URI', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, null)

      expect(presenter.backLinkUri).toEqual(`/group/${groupId}/sessions-and-attendance`)
    })
  })

  describe('sessionTemplates', () => {
    it('should return the available session templates', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, null)

      expect(presenter.sessionTemplates).toEqual(mockScheduleSessionTypeResponse.sessionTemplates)
    })
  })

  describe('fields', () => {
    it('should return fields with selected session template ID', () => {
      const selectedTemplateId = mockScheduleSessionTypeResponse.sessionTemplates[0].id
      const presenter = new SessionScheduleWhichPresenter(
        groupId,
        mockScheduleSessionTypeResponse,
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
      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, null)

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

      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, validationError)

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

      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, validationError)

      expect(presenter.errorSummary).toEqual([{ field: 'session-template', message: 'Select a session' }])
    })

    it('should return null when no validation error exists', () => {
      const presenter = new SessionScheduleWhichPresenter(groupId, mockScheduleSessionTypeResponse, null)

      expect(presenter.errorSummary).toBeNull()
    })
  })
})
