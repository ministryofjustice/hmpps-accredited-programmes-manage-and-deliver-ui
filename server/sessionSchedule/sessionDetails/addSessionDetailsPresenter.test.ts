import { ScheduleIndividualSessionDetailsResponse, CreateGroupTeamMember } from '@manage-and-deliver-api'
import AddSessionDetailsPresenter from './addSessionDetailsPresenter'

describe('AddSessionDetailsPresenter', () => {
  const sessionDetails = {
    facilitators: [
      { personName: 'Facilitator One', personCode: 'F001', teamName: 'Team A', teamCode: 'TA01' },
      { personName: 'Facilitator Two', personCode: 'F002', teamName: 'Team B', teamCode: 'TA02' },
    ],
    groupMembers: [
      { name: 'John Doe', crn: 'X12345', referralId: 'ref1' },
      { name: 'Jane Smith', crn: 'Y67890', referralId: 'ref2' },
    ],
  } as ScheduleIndividualSessionDetailsResponse

  describe('generateFacilitatorSelectOptions', () => {
    it('generates select options with facilitator data', () => {
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri')
      const options = presenter.generateFacilitatorSelectOptions('F001')

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
    })
  })

  describe('generateSessionAttendeesCheckboxOptions', () => {
    it('generates checkbox options without selections', () => {
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri')
      const options = presenter.generateSessionAttendeesRadioOptions(['ref1'])

      expect(options).toEqual([
        { text: 'John Doe (X12345)', value: 'ref1 + John Doe', checked: true },
        { text: 'Jane Smith (Y67890)', value: 'ref2 + Jane Smith', checked: false },
      ])
    })
  })

  describe('selectedAttendeeValues', () => {
    it('returns values from userInputData when available', () => {
      const userInputData = { 'session-details-who': 'ref1 + John Doe' }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, null, userInputData)
      expect(presenter.selectedAttendeeValues()).toEqual(['ref1'])
    })

    it('returns values from createSessionDetailsFormData when userInputData not available', () => {
      const formData = { referralIds: ['X12345'] }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)
      expect(presenter.selectedAttendeeValues()).toEqual(['X12345'])
    })
  })

  describe('generateSelectedFacilitators', () => {
    it('parses facilitators from userInputData', () => {
      const userInputData = {
        'session-details-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, null, userInputData)
      const facilitators = presenter.generateSelectedFacilitators()

      expect(facilitators).toHaveLength(1)
      expect(facilitators[0]).toEqual({
        facilitator: 'John Doe',
        facilitatorCode: 'F001',
        teamName: 'Team A',
        teamCode: 'TA01',
      })
    })

    it('handles multiple facilitators from userInputData', () => {
      const userInputData = {
        'session-details-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        'session-details-facilitator-1':
          '{"facilitator":"Jane Smith", "facilitatorCode":"F002", "teamName":"Team B", "teamCode":"TB02"}',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, null, userInputData)
      const facilitators = presenter.generateSelectedFacilitators()

      expect(facilitators).toHaveLength(2)
    })

    it('returns facilitators from formData when userInputData not available', () => {
      const mockFacilitators: CreateGroupTeamMember[] = [
        {
          facilitator: 'John Doe',
          facilitatorCode: 'F001',
          teamName: 'Team A',
          teamCode: 'TA01',
          teamMemberType: 'REGULAR_FACILITATOR',
        },
      ]
      const formData = { facilitators: mockFacilitators }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)
      expect(presenter.generateSelectedFacilitators()).toEqual(mockFacilitators)
    })

    it('filters out non-facilitator keys from userInputData', () => {
      const userInputData = {
        'session-details-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        'session-details-other': 'some value',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, null, userInputData)
      const facilitators = presenter.generateSelectedFacilitators()

      expect(facilitators).toHaveLength(1)
    })
  })

  describe('generatePlaceholderSessionDate', () => {
    it('returns only startDate when it is a group session', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'GROUP',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })

    it('returns startDate when it is NOT a group session and startDate is available', () => {
      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'INDIVIDUAL',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })

    it('returns suggestedDate when it is NOT a group session and startDate is not available', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '05/01/2027',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        groupOrOneToOne: 'INDIVIDUAL',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('05/01/2027')
    })

    it('returns empty string when it is NOT a group session and neither startDate nor suggestedDate are available', () => {
      const formData = {
        groupOrOneToOne: 'INDIVIDUAL',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('')
    })

    it('returns empty string when it is a group session and no startDate is available', () => {
      const formData = {
        groupOrOneToOne: 'GROUP',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe(undefined)
    })

    it('prefers startDate over suggestedDate for individual sessions', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'INDIVIDUAL',
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })
  })
})
