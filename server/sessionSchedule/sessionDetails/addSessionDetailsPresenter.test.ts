import { ScheduleIndividualSessionDetailsResponse, CreateGroupTeamMember } from '@manage-and-deliver-api'
import AddSessionDetailsPresenter from './addSessionDetailsPresenter'

describe('AddSessionDetailsPresenter', () => {
  const backLinkUri = '/schedule-group-session-details'
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
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails)
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
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails)
      const options = presenter.generateSessionAttendeesCheckboxOptions(['X12345'])

      expect(options).toEqual([
        { text: 'John Doe', value: 'X12345', checked: true },
        { text: 'Jane Smith', value: 'Y67890', checked: false },
      ])
    })
  })

  describe('selectedLocationValues', () => {
    it('returns values from userInputData when available', () => {
      const userInputData = { 'session-details-who': ['X12345', 'Y67890'] }
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, null, userInputData)
      expect(presenter.selectedAttendeeValues()).toEqual(['X12345', 'Y67890'])
    })

    it('returns values from createSessionDetailsFormData when userInputData not available', () => {
      const formData = { referralIds: ['X12345'] }
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, formData)
      expect(presenter.selectedAttendeeValues()).toEqual(['X12345'])
    })

    it('handles single string value from userInputData', () => {
      const userInputData = { 'session-details-who': 'X12345' }
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, null, userInputData)
      expect(presenter.selectedAttendeeValues()).toEqual(['X12345'])
    })
  })

  describe('generateSelectedFacilitators', () => {
    it('parses facilitators from userInputData', () => {
      const userInputData = {
        'session-details-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
      }
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, null, userInputData)
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
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, null, userInputData)
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
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, formData)
      expect(presenter.generateSelectedFacilitators()).toEqual(mockFacilitators)
    })

    it('filters out non-facilitator keys from userInputData', () => {
      const userInputData = {
        'session-details-facilitator-0':
          '{"facilitator":"John Doe", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        'session-details-other': 'some value',
      }
      const presenter = new AddSessionDetailsPresenter(backLinkUri, sessionDetails, null, null, userInputData)
      const facilitators = presenter.generateSelectedFacilitators()

      expect(facilitators).toHaveLength(1)
    })
  })
})
