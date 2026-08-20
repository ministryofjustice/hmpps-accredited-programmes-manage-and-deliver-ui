import {
  ScheduleIndividualSessionDetailsResponse,
  CreateGroupTeamMember,
  SessionScheduleType,
} from '@manage-and-deliver-api'
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

  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri')

      expect(presenter.pageTitle).toBe('Add session details')
    })
  })

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

  describe('generateSessionAttendeesRadioOptions', () => {
    it('generates radio options with selections', () => {
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri')
      const options = presenter.generateSessionAttendeesRadioOptions(['ref1'])

      expect(options).toEqual([
        { html: 'John Doe (X12345)', value: 'ref1 + John Doe', checked: true, disabled: false },
        { html: 'Jane Smith (Y67890)', value: 'ref2 + Jane Smith', checked: false, disabled: false },
      ])
    })

    it('does not expose the name of a restricted participant and disables their option', () => {
      const restrictedSessionDetails = {
        ...sessionDetails,
        groupMembers: [{ name: 'Restricted Name', crn: 'X12345', referralId: 'ref1', isExcluded: true }],
      } as ScheduleIndividualSessionDetailsResponse
      const presenter = new AddSessionDetailsPresenter(restrictedSessionDetails, 'backLinkUri')

      expect(presenter.generateSessionAttendeesRadioOptions([])).toEqual([
        {
          html: 'X12345<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span><p>You cannot add a restricted participant to the session.</p>',
          value: 'ref1 + X12345',
          checked: false,
          disabled: true,
        },
      ])
    })

    it('sorts restricted participants to the bottom of the list', () => {
      const mixedSessionDetails = {
        ...sessionDetails,
        groupMembers: [
          { name: 'Restricted Name', crn: 'X12345', referralId: 'ref1', isExcluded: true },
          { name: 'John Doe', crn: 'Y67890', referralId: 'ref2', isExcluded: false },
          { name: 'Jane Smith', crn: 'Z11111', referralId: 'ref3', isExcluded: false },
        ],
      } as ScheduleIndividualSessionDetailsResponse
      const presenter = new AddSessionDetailsPresenter(mixedSessionDetails, 'backLinkUri')

      const options = presenter.generateSessionAttendeesRadioOptions([])

      expect(options.map(option => option.value)).toEqual(['ref2 + John Doe', 'ref3 + Jane Smith', 'ref1 + X12345'])
    })
  })

  describe('generateSessionAttendeesCheckboxOptions', () => {
    it('generates checkbox options with selections', () => {
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri')
      const options = presenter.generateSessionAttendeesCheckboxOptions(['ref1'])

      expect(options).toEqual([
        { html: 'John Doe (X12345)', value: 'ref1 + John Doe', checked: true, disabled: false },
        { html: 'Jane Smith (Y67890)', value: 'ref2 + Jane Smith', checked: false, disabled: false },
      ])
    })

    it('does not expose the name of a restricted participant and disables their option', () => {
      const restrictedSessionDetails = {
        ...sessionDetails,
        groupMembers: [{ name: 'Restricted Name', crn: 'X12345', referralId: 'ref1', isExcluded: true }],
      } as ScheduleIndividualSessionDetailsResponse
      const presenter = new AddSessionDetailsPresenter(restrictedSessionDetails, 'backLinkUri')

      expect(presenter.generateSessionAttendeesCheckboxOptions([])).toEqual([
        {
          html: 'X12345<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span><p>You cannot add a restricted participant to the session.</p>',
          value: 'ref1 + X12345',
          checked: false,
          disabled: true,
        },
      ])
    })

    it('sorts restricted participants to the bottom of the list', () => {
      const mixedSessionDetails = {
        ...sessionDetails,
        groupMembers: [
          { name: 'Restricted Name', crn: 'X12345', referralId: 'ref1', isExcluded: true },
          { name: 'John Doe', crn: 'Y67890', referralId: 'ref2', isExcluded: false },
          { name: 'Jane Smith', crn: 'Z11111', referralId: 'ref3', isExcluded: false },
        ],
      } as ScheduleIndividualSessionDetailsResponse
      const presenter = new AddSessionDetailsPresenter(mixedSessionDetails, 'backLinkUri')

      const options = presenter.generateSessionAttendeesCheckboxOptions([])

      expect(options.map(option => option.value)).toEqual(['ref2 + John Doe', 'ref3 + Jane Smith', 'ref1 + X12345'])
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
    it('returns startDate when it is a group session', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'GROUP',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })

    it('returns user entered date (startDate) when it is a catch-up session', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'CATCH_UP' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })

    it('returns undefined when it is a catch-up session and no user entered date (startDate) is available', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'CATCH_UP' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe(undefined)
    })

    it('returns user entered date (startDate) when it is NOT a group session or catch-up and startDate is available', () => {
      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })

    it('returns suggestedDate when it is NOT a group session or catch-up and user entered date (startDate) is not available', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '05/01/2027',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('05/01/2027')
    })

    it('returns empty string when it is NOT a group session or catch-up and neither startDate nor suggestedDate are available', () => {
      const formData = {
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('')
    })

    it('returns undefined when it is a group session and no startDate is available', () => {
      const formData = {
        groupOrOneToOne: 'GROUP',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetails, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe(undefined)
    })

    it('prefers user entered date (startDate) over suggestedDate for individual scheduled sessions', () => {
      const sessionDetailsWithSuggestedDate = {
        ...sessionDetails,
        suggestedDate: '15/01/2026',
      } as ScheduleIndividualSessionDetailsResponse

      const formData = {
        startDate: '01/02/2026',
        groupOrOneToOne: 'INDIVIDUAL',
        sessionScheduleType: 'SCHEDULED' as SessionScheduleType,
      }
      const presenter = new AddSessionDetailsPresenter(sessionDetailsWithSuggestedDate, 'backLinkUri', null, formData)

      expect(presenter.generatePlaceholderSessionDate).toBe('01/02/2026')
    })
  })
})
