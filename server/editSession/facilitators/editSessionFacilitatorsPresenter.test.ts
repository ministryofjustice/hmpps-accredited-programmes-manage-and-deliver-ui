import { EditSessionFacilitatorsResponse } from '@manage-and-deliver-api'
import EditSessionFacilitatorsPresenter from './editSessionFacilitatorsPresenter'

describe('EditSessionFacilitatorsPresenter', () => {
  const linkUrl = '/group-123/session-456/edit-session'
  const groupId = 'group-123'
  const editSessionFacilitatorsResponse: EditSessionFacilitatorsResponse = {
    pageTitle: 'Edit Getting started',
    facilitators: [
      {
        facilitatorName: 'John Smith',
        facilitatorCode: 'FAC-001',
        teamName: 'Team A',
        teamCode: 'TEAM-A',
        currentlyFacilitating: true,
      },
      {
        facilitatorName: 'Jane Doe',
        facilitatorCode: 'FAC-002',
        teamName: 'Team B',
        teamCode: 'TEAM-B',
        currentlyFacilitating: false,
      },
      {
        facilitatorName: 'Bob Wilson',
        facilitatorCode: 'FAC-003',
        teamName: 'Team A',
        teamCode: 'TEAM-A',
        currentlyFacilitating: true,
      },
    ],
  }

  describe('backLinkArgs', () => {
    it('should return back link object with correct text and href', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const { backLinkArgs } = presenter

      expect(backLinkArgs).toEqual({
        text: 'Back',
        href: linkUrl,
      })
    })
  })

  describe('pageTitles', () => {
    it('should return Edit the session facilitators', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      expect(presenter.pageTitles).toBe('Edit the session facilitators')
    })
  })

  describe('text', () => {
    it('should return correct page heading and caption', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const { text } = presenter

      expect(text).toEqual({
        pageHeading: 'Edit the session facilitators',
        pageCaption: 'Edit Getting started',
      })
    })
  })

  describe('errorSummary', () => {
    describe('when there is no validation error', () => {
      it('should return null', () => {
        const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse, null)

        expect(presenter.errorSummary).toBeNull()
      })
    })

    describe('when there is a validation error', () => {
      it('should return error summary', () => {
        const validationError = {
          errors: [
            {
              errorSummaryLinkedField: 'edit-session-facilitator-0',
              formFields: ['edit-session-facilitator-0'],
              message: 'Select at least one facilitator',
            },
          ],
        }
        const presenter = new EditSessionFacilitatorsPresenter(
          linkUrl,
          groupId,
          editSessionFacilitatorsResponse,
          validationError,
        )

        expect(presenter.errorSummary).not.toBeNull()
      })
    })
  })

  describe('generateSelectOptions', () => {
    it('should return select options with empty option first', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const options = presenter.generateSelectOptions()

      expect(options).toHaveLength(4)
      expect(options[0]).toEqual({
        text: '',
        value: '',
      })
    })

    it('should include all facilitators in select options', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const options = presenter.generateSelectOptions()

      expect(options[1].text).toBe('John Smith')
      expect(options[2].text).toBe('Jane Doe')
      expect(options[3].text).toBe('Bob Wilson')
    })

    it('should mark selected facilitator as selected', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const options = presenter.generateSelectOptions('FAC-002')

      expect(options[2].selected).toBe(true)
      expect(options[1].selected).toBeFalsy()
      expect(options[3].selected).toBeFalsy()
    })

    it('should format facilitator value as JSON string', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const options = presenter.generateSelectOptions()

      const firstFacilitatorOption = options[1]
      const parsedValue = JSON.parse(firstFacilitatorOption.value as string)

      expect(parsedValue).toEqual({
        facilitatorName: 'John Smith',
        facilitatorCode: 'FAC-001',
        teamName: 'Team A',
        teamCode: 'TEAM-A',
      })
    })
  })

  describe('generateSelectedUsers', () => {
    it('should return currently facilitating users when no user input data', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      const selectedUsers = presenter.generateSelectedUsers()

      expect(selectedUsers.facilitators).toHaveLength(2)
      expect(selectedUsers.facilitators[0].facilitatorCode).toBe('FAC-001')
      expect(selectedUsers.facilitators[1].facilitatorCode).toBe('FAC-003')
    })

    it('should return empty array when no facilitators are currently facilitating', () => {
      const responseWithoutCurrentFacilitators: EditSessionFacilitatorsResponse = {
        pageTitle: 'Edit Getting started',
        facilitators: [
          {
            facilitatorName: 'Jane Doe',
            facilitatorCode: 'FAC-002',
            teamName: 'Team B',
            teamCode: 'TEAM-B',
            currentlyFacilitating: false,
          },
        ],
      }

      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, responseWithoutCurrentFacilitators)

      const selectedUsers = presenter.generateSelectedUsers()

      expect(selectedUsers.facilitators).toHaveLength(0)
    })

    it('should parse user input data when available', () => {
      const userInputData = {
        _csrf: 'token123',
        'edit-session-facilitator-0':
          '{"facilitatorName":"John Smith", "facilitatorCode":"FAC-001", "teamName":"Team A", "teamCode":"TEAM-A"}',
        'edit-session-facilitator-1':
          '{"facilitatorName":"Jane Doe", "facilitatorCode":"FAC-002", "teamName":"Team B", "teamCode":"TEAM-B"}',
      }

      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )

      const selectedUsers = presenter.generateSelectedUsers()

      expect(selectedUsers.facilitators).toHaveLength(2)
      expect(selectedUsers.facilitators[0].facilitatorCode).toBe('FAC-001')
      expect(selectedUsers.facilitators[1].facilitatorCode).toBe('FAC-002')
    })

    it('should filter out empty strings from user input', () => {
      const userInputData = {
        _csrf: 'token123',
        'edit-session-facilitator-0':
          '{"facilitatorName":"John Smith", "facilitatorCode":"FAC-001", "teamName":"Team A", "teamCode":"TEAM-A"}',
        'edit-session-facilitator-1': '',
      }

      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )

      const selectedUsers = presenter.generateSelectedUsers()

      expect(selectedUsers.facilitators).toHaveLength(1)
      expect(selectedUsers.facilitators[0].facilitatorCode).toBe('FAC-001')
    })
  })

  describe('errorMessageForField', () => {
    it('should return null when no validation error', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      expect(presenter.errorMessageForField('edit-session-facilitator-0')).toBeNull()
    })

    it('should return error message when validation error exists', () => {
      const validationError = {
        errors: [
          {
            errorSummaryLinkedField: 'edit-session-facilitator-0',
            formFields: ['edit-session-facilitator-0'],
            message: 'Select at least one facilitator',
          },
        ],
      }
      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        validationError,
      )

      expect(presenter.errorMessageForField('edit-session-facilitator-0')).toBe('Select at least one facilitator')
    })
  })

  describe('utils', () => {
    it('should return PresenterUtils instance', () => {
      const presenter = new EditSessionFacilitatorsPresenter(linkUrl, groupId, editSessionFacilitatorsResponse)

      expect(presenter.utils).toBeDefined()
      expect(presenter.utils.stringValue).toBeDefined()
    })

    it('should return PresenterUtils with user input data when available', () => {
      const userInputData = {
        'facilitator-0': 'FAC-001',
      }

      const presenter = new EditSessionFacilitatorsPresenter(
        linkUrl,
        groupId,
        editSessionFacilitatorsResponse,
        null,
        userInputData,
      )

      expect(presenter.utils).toBeDefined()
    })
  })
})
