import { CreateGroupRequest, UserTeamMember } from '@manage-and-deliver-api'
import CreateGroupTreatmentManagerPresenter from './groupCreateTreatmentManagerPresenter'

describe('CreateGroupTreatmentManagerPresenter', () => {
  const mockMembers: UserTeamMember[] = [
    {
      personName: 'John Smith',
      personCode: 'JS123',
      teamName: 'Team A',
      teamCode: 'TA001',
    },
    {
      personName: 'Jane Doe',
      personCode: 'JD456',
      teamName: 'Team B',
      teamCode: 'TB002',
    },
  ]
  describe('generateSelectOptions', () => {
    it('generates select options with empty first option', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers)
      const options = presenter.generateSelectOptions('TREATMENT_MANAGER')

      expect(options[0]).toEqual({
        text: '',
        value: '',
      })
      expect(options).toHaveLength(3)
    })

    it('generates select options with correct member data', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers)
      const options = presenter.generateSelectOptions('REGULAR_FACILITATOR')

      expect(options[1]).toEqual({
        text: 'John Smith',
        value:
          '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"REGULAR_FACILITATOR"}',
        selected: false,
      })
      expect(options[2]).toEqual({
        text: 'Jane Doe',
        value:
          '{"facilitator":"Jane Doe", "facilitatorCode":"JD456", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"REGULAR_FACILITATOR"}',
        selected: false,
      })
    })

    it('marks the correct option as selected when selectedValue is provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers)
      const options = presenter.generateSelectOptions('TREATMENT_MANAGER', 'JS123')

      expect(options[1].selected).toBe(true)
      expect(options[2].selected).toBe(false)
    })
  })

  describe('generateSelectedUsers', () => {
    it('returns empty structure when no data is provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers)
      const result = presenter.generateSelectedUsers()

      expect(result).toEqual({
        treatmentManager: undefined,
        facilitators: [],
        coverFacilitators: [],
      })
    })

    it('parses facilitators and cover facilitators from userInputData', () => {
      const userInputData = {
        _csrf: 'token',
        'create-group-facilitator1':
          '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"REGULAR_FACILITATOR"}',
        'create-group-cover-facilitator1':
          '{"facilitator":"Jane Doe", "facilitatorCode":"JD456", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-treatment-manager':
          '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"TREATMENT_MANAGER"}',
        'create-group-cover-facilitator2':
          '{"facilitator":"Jane Doez", "facilitatorCode":"JD457", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-cover-facilitator3':
          '{"facilitator":"Jane Doey", "facilitatorCode":"JD458", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-cover-facilitator4': '',
      }
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers, null, null, userInputData)
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0].facilitatorCode).toBe('JS123')
      expect(result.coverFacilitators).toHaveLength(3)
      expect(result.coverFacilitators[0].facilitatorCode).toBe('JD456')
      expect(result.treatmentManager).toEqual({
        facilitator: 'John Smith',
        facilitatorCode: 'JS123',
        teamName: 'Team A',
        teamCode: 'TA001',
        teamMemberType: 'TREATMENT_MANAGER',
      })
    })

    it('parses members from createGroupFormData when userInputData is not provided', () => {
      const createGroupFormData = {
        teamMembers: [
          {
            facilitator: 'John Smith',
            facilitatorCode: 'JS123',
            teamName: 'Team A',
            teamCode: 'TA001',
            teamMemberType: 'TREATMENT_MANAGER',
          },
          {
            facilitator: 'Jane Doe',
            facilitatorCode: 'JD456',
            teamName: 'Team B',
            teamCode: 'TB002',
            teamMemberType: 'REGULAR_FACILITATOR',
          },
        ],
      } as unknown as Partial<CreateGroupRequest>
      const presenter = new CreateGroupTreatmentManagerPresenter(mockMembers, null, createGroupFormData, null)
      const result = presenter.generateSelectedUsers()

      expect(result.treatmentManager.facilitatorCode).toBe('JS123')
      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0].facilitatorCode).toBe('JD456')
    })
  })
})
