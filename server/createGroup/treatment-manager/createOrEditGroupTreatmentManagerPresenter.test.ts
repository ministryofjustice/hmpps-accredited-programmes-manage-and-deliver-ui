import { CreateGroupRequest, UserTeamMember } from '@manage-and-deliver-api'
import CreateGroupTreatmentManagerPresenter from './createOrEditGroupTreatmentManagerPresenter'

describe('CreateGroupTreatmentManagerPresenter', () => {
  const mockMembers: UserTeamMember[] = [
    {
      personName: 'Archibald Queeny',
      personCode: 'JS123',
      teamName: 'Team A',
      teamCode: 'TA001',
    },
    {
      personName: 'Chloe Ransom',
      personCode: 'JD456',
      teamName: 'Team B',
      teamCode: 'TB002',
    },
  ]
  describe('generateSelectOptions', () => {
    it('generates select options with empty first option', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers)
      const options = presenter.generateSelectOptions('TREATMENT_MANAGER')

      expect(options[0]).toEqual({
        text: '',
        value: '',
      })
      expect(options).toHaveLength(3)
    })

    it('generates select options with correct member data', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers)
      const options = presenter.generateSelectOptions('REGULAR_FACILITATOR')

      expect(options[1]).toEqual({
        text: 'Archibald Queeny',
        value:
          '{"facilitator":"Archibald Queeny", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"REGULAR_FACILITATOR"}',
        selected: false,
      })
      expect(options[2]).toEqual({
        text: 'Chloe Ransom',
        value:
          '{"facilitator":"Chloe Ransom", "facilitatorCode":"JD456", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"REGULAR_FACILITATOR"}',
        selected: false,
      })
    })

    it('marks the correct option as selected when selectedValue is provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers)
      const options = presenter.generateSelectOptions('TREATMENT_MANAGER', 'JS123')

      expect(options[1].selected).toBe(true)
      expect(options[2].selected).toBe(false)
    })
  })

  describe('generateSelectedUsers', () => {
    it('returns empty structure when no data is provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers)
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
          '{"facilitator":"Archibald Queeny", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"REGULAR_FACILITATOR"}',
        'create-group-cover-facilitator1':
          '{"facilitator":"Chloe Ransom", "facilitatorCode":"JD456", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-treatment-manager':
          '{"facilitator":"Archibald Queeny", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"TREATMENT_MANAGER"}',
        'create-group-cover-facilitator2':
          '{"facilitator":"Chloe Ransom", "facilitatorCode":"JD457", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-cover-facilitator3':
          '{"facilitator":"Chloe Ransom", "facilitatorCode":"JD458", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"COVER_FACILITATOR"}',
        'create-group-cover-facilitator4': '',
      }
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers, null, null, userInputData)
      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0].facilitatorCode).toBe('JS123')
      expect(result.coverFacilitators).toHaveLength(3)
      expect(result.coverFacilitators[0].facilitatorCode).toBe('JD456')
      expect(result.treatmentManager).toEqual({
        facilitator: 'Archibald Queeny',
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
            facilitator: 'Archibald Queeny',
            facilitatorCode: 'JS123',
            teamName: 'Team A',
            teamCode: 'TA001',
            teamMemberType: 'TREATMENT_MANAGER',
          },
          {
            facilitator: 'Chloe Ransom',
            facilitatorCode: 'JD456',
            teamName: 'Team B',
            teamCode: 'TB002',
            teamMemberType: 'REGULAR_FACILITATOR',
          },
        ],
      } as unknown as Partial<CreateGroupRequest>
      const presenter = new CreateGroupTreatmentManagerPresenter('', '', mockMembers, null, createGroupFormData, null)
      const result = presenter.generateSelectedUsers()

      expect(result.treatmentManager.facilitatorCode).toBe('JS123')
      expect(result.facilitators).toHaveLength(1)
      expect(result.facilitators[0].facilitatorCode).toBe('JD456')
    })
  })

  describe('insetText', () => {
    it('shows inset text when isEditJourney is true', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('group-id', 'TEST123', mockMembers)

      expect(presenter.insetText).toBe(
        'This will change the overall group details and facilitators assigned to future sessions. The assigned facilitators will not change for any sessions that have already taken place.',
      )
    })

    it('returns empty inset text when isEditJourney is false', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', 'TEST123', mockMembers)

      expect(presenter.insetText).toBe('')
    })
  })

  describe('isEditJourney dependent values', () => {
    it('returns edit journey values when groupId is provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('group-id', 'TEST123', mockMembers)

      expect(presenter.isEditJourney).toBe(true)
      expect(presenter.backLinkUri).toBe('/group/group-id/group-details')
      expect(presenter.captionText).toBe('Edit group TEST123')
      expect(presenter.pageTitle).toBe('Edit who is responsible for the group')
      expect(presenter.submitButtonText).toBe('Submit')
    })

    it('returns create journey values when groupId is not provided', () => {
      const presenter = new CreateGroupTreatmentManagerPresenter('', 'TEST123', mockMembers)

      expect(presenter.isEditJourney).toBe(false)
      expect(presenter.backLinkUri).toBe('/group/create-a-group/group-delivery-location')
      expect(presenter.captionText).toBe('Create group TEST123')
      expect(presenter.pageTitle).toBe('Who is responsible for the group?')
      expect(presenter.submitButtonText).toBe('Continue')
    })
  })
})
