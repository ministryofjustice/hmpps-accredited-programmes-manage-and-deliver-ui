import { EditSessionFacilitatorsResponse } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { FormValidationError } from '../../utils/formValidationError'
import EditSessionFacilitatorsPresenter from './editSessionFacilitatorsPresenter'

describe('EditSessionFacilitatorsPresenter', () => {
  const groupId = randomUUID()
  const sesionId = randomUUID()
  const linkUrl = `/group/${groupId}/session/${sesionId}`
  const editSessionFacilitatorsResponse = {
    pageTitle: 'Getting Started 1',
    facilitators: [
      {
        facilitator: 'Facilitator One',
        facilitatorCode: 'F001',
        teamName: 'Team A',
        teamCode: 'TA01',
        currentlyFacilitating: true,
      },
      {
        facilitator: 'Facilitator Two',
        facilitatorCode: 'F002',
        teamName: 'Team B',
        teamCode: 'TA02',
        currentlyFacilitating: false,
      },
      {
        facilitator: 'Facilitator Three',
        facilitatorCode: 'F003',
        teamName: 'Team C',
        teamCode: 'TA03',
        currentlyFacilitating: true,
      },
    ],
  } as EditSessionFacilitatorsResponse

  describe('backLinkArgs', () => {
    it('returns the correct back link arguments', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      expect(presenter.backLinkArgs).toEqual({
        text: 'Back',
        href: linkUrl,
      })
    })
  })

  describe('text', () => {
    it('returns the correct page text', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      expect(presenter.text).toEqual({
        pageHeading: 'Edit the session facilitators',
        pageCaption: 'Getting Started 1',
      })
    })
  })

  describe('errorSummary', () => {
    it('returns null when no validation errors', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse, null)
      expect(presenter.errorSummary).toBeNull()
    })

    it('returns error summary when validation errors exist', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-facilitator'],
            errorSummaryLinkedField: 'edit-session-facilitator',
            message: 'Select a Facilitator. Start typing to search.',
          },
        ],
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        validationError,
      )
      expect(presenter.errorSummary).toBeDefined()
    })
  })

  describe('generateSelectOptions', () => {
    it('generates select options with facilitator data', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      const options = presenter.generateSelectOptions('F001')

      expect(options[0]).toEqual({ text: '', value: '' })
      expect(options[1]).toEqual({
        text: 'Facilitator One',
        value: '{"facilitator":"Facilitator One", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        selected: true,
      })
      expect(options[2]).toEqual({
        text: 'Facilitator Two',
        value: '{"facilitator":"Facilitator Two", "facilitatorCode":"F002", "teamName":"Team B", "teamCode":"TA02"}',
        selected: false,
      })
      expect(options[3]).toEqual({
        text: 'Facilitator Three',
        value: '{"facilitator":"Facilitator Three", "facilitatorCode":"F003", "teamName":"Team C", "teamCode":"TA03"}',
        selected: false,
      })
    })

    it('generates select options with no selection when selectedValue not provided', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      const options = presenter.generateSelectOptions()

      expect(options[0]).toEqual({ text: '', value: '' })
      expect(options[1].selected).toBe(false)
      expect(options[2].selected).toBe(false)
      expect(options[3].selected).toBe(false)
    })

    it('generates select options with correct length', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      const options = presenter.generateSelectOptions()

      expect(options).toHaveLength(4) // 1 empty + 3 facilitators
    })
  })

  describe('generateSelectedUsers', () => {
    it('returns facilitators from userInputData when available', () => {
      const userInputData = {
        _csrf: 'token',
        'edit-session-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        'edit-session-facilitator-1':
          '{"facilitator":"Jane Smith", "facilitatorCode":"F002", "teamName":"Team B", "teamCode":"TB02"}',
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(2)
      expect(result.facilitators[0]).toEqual({
        facilitator: 'John Doe',
        facilitatorCode: 'F001',
        teamName: 'Team A',
        teamCode: 'TA01',
      })
      expect(result.facilitators[1]).toEqual({
        facilitator: 'Jane Smith',
        facilitatorCode: 'F002',
        teamName: 'Team B',
        teamCode: 'TB02',
      })
    })

    it('filters out empty strings from userInputData', () => {
      const userInputData = {
        _csrf: 'token',
        'edit-session-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        'edit-session-facilitator-1': '',
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0]).toEqual({
        facilitator: 'John Doe',
        facilitatorCode: 'F001',
        teamName: 'Team A',
        teamCode: 'TA01',
      })
    })

    it('excludes _csrf from parsed members', () => {
      const userInputData = {
        _csrf: 'token',
        'edit-session-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0]).not.toHaveProperty('_csrf')
    })

    it('returns currently facilitating facilitators when userInputData not available', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(2)
      expect(result.facilitators).toEqual([
        {
          facilitator: 'Facilitator One',
          facilitatorCode: 'F001',
          teamName: 'Team A',
          teamCode: 'TA01',
          currentlyFacilitating: true,
        },
        {
          facilitator: 'Facilitator Three',
          facilitatorCode: 'F003',
          teamName: 'Team C',
          teamCode: 'TA03',
          currentlyFacilitating: true,
        },
      ])
    })

    it('returns empty array when no facilitators are currently facilitating', () => {
      const responseWithNoCurrentFacilitators = {
        ...editSessionFacilitatorsResponse,
        facilitators: [
          {
            facilitator: 'Facilitator One',
            facilitatorCode: 'F001',
            teamName: 'Team A',
            teamCode: 'TA01',
            currentlyFacilitating: false,
          },
        ],
      } as EditSessionFacilitatorsResponse

      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, responseWithNoCurrentFacilitators)
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toEqual([])
    })
  })

  describe('fields', () => {
    it('returns empty error message when no validation errors', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse, null)
      expect(presenter.fields.editSessionFacilitator.errorMessage).toBeNull()
    })

    it('returns error message when validation errors exist', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-facilitator'],
            errorSummaryLinkedField: 'edit-session-facilitator',
            message: 'Select a Facilitator. Start typing to search.',
          },
        ],
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        validationError,
      )
      expect(presenter.fields.editSessionFacilitator.errorMessage).toBeDefined()
    })
  })
})
