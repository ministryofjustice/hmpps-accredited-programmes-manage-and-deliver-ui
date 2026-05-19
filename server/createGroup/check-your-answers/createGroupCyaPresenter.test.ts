import { CreateGroupRequest, CreateGroupSessionSlot, CreateGroupTeamMember } from '@manage-and-deliver-api'
import CreateGroupCyaPresenter from './createGroupCyaPresenter'
import CreateGroupUtils from '../createGroupUtils'
import GroupDaysTimesUtils from '../../utils/groupDaysTimesUtils'

jest.mock('../createGroupUtils')
jest.mock('../../utils/groupDaysTimesUtils')

describe('CreateGroupCyaPresenter', () => {
  const mockCreateGroupUtils = CreateGroupUtils as jest.MockedClass<typeof CreateGroupUtils>
  const mockGroupDaysTimesUtils = GroupDaysTimesUtils as jest.Mocked<typeof GroupDaysTimesUtils>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('text', () => {
    it('returns heading hint text with group code', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      expect(presenter.text).toEqual({
        headingHintText: 'Create group ABC123',
      })
    })

    it('returns heading hint text with undefined group code', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: undefined,
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      expect(presenter.text.headingHintText).toContain('Create group')
    })
  })

  describe('backLinkUri', () => {
    it('returns correct back link to group facilitators', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {}
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      expect(presenter.backLinkUri).toEqual('/group-facilitators')
    })
  })

  describe('pageTitle', () => {
    it('returns correct page title', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {}
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      expect(presenter.pageTitle).toEqual('Review your group details')
    })
  })

  describe('generateSelectedUsers', () => {
    it('returns empty structure when no team members provided', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {}
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result).toEqual({
        treatmentManager: undefined,
        facilitators: [],
        coverFacilitators: [],
      })
    })

    it('returns empty structure when team members array is empty', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        teamMembers: [],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result).toEqual({
        treatmentManager: undefined,
        facilitators: [],
        coverFacilitators: [],
      })
    })

    it('returns treatment manager when team members include one', () => {
      const treatmentManager: CreateGroupTeamMember = {
        facilitator: 'Alex River',
        facilitatorCode: 'JS001',
        teamName: 'Team A',
        teamCode: 'TA001',
        teamMemberType: 'TREATMENT_MANAGER',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        teamMembers: [treatmentManager],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result.treatmentManager).toEqual(treatmentManager)
      expect(result.facilitators).toEqual([])
      expect(result.coverFacilitators).toEqual([])
    })

    it('returns regular facilitators when team members include them', () => {
      const facilitator1: CreateGroupTeamMember = {
        facilitator: 'Jane Doe',
        facilitatorCode: 'JD001',
        teamName: 'Team B',
        teamCode: 'TB001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const facilitator2: CreateGroupTeamMember = {
        facilitator: 'Bob Johnson',
        facilitatorCode: 'BJ001',
        teamName: 'Team C',
        teamCode: 'TC001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        teamMembers: [facilitator1, facilitator2],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result.facilitators).toHaveLength(2)
      expect(result.facilitators).toEqual([facilitator1, facilitator2])
      expect(result.treatmentManager).toBeUndefined()
      expect(result.coverFacilitators).toEqual([])
    })

    it('returns cover facilitators when team members include them', () => {
      const coverFacilitator1: CreateGroupTeamMember = {
        facilitator: 'Alice Brown',
        facilitatorCode: 'AB001',
        teamName: 'Team D',
        teamCode: 'TD001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      const coverFacilitator2: CreateGroupTeamMember = {
        facilitator: 'Charlie Wilson',
        facilitatorCode: 'CW001',
        teamName: 'Team E',
        teamCode: 'TE001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        teamMembers: [coverFacilitator1, coverFacilitator2],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result.coverFacilitators).toHaveLength(2)
      expect(result.coverFacilitators).toEqual([coverFacilitator1, coverFacilitator2])
      expect(result.treatmentManager).toBeUndefined()
      expect(result.facilitators).toEqual([])
    })

    it('returns all types of team members when all are present', () => {
      const treatmentManager: CreateGroupTeamMember = {
        facilitator: 'John Smith',
        facilitatorCode: 'JS001',
        teamName: 'Team A',
        teamCode: 'TA001',
        teamMemberType: 'TREATMENT_MANAGER',
      }
      const facilitator: CreateGroupTeamMember = {
        facilitator: 'Jane Doe',
        facilitatorCode: 'JD001',
        teamName: 'Team B',
        teamCode: 'TB001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const coverFacilitator: CreateGroupTeamMember = {
        facilitator: 'Alice Brown',
        facilitatorCode: 'AB001',
        teamName: 'Team D',
        teamCode: 'TD001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        teamMembers: [treatmentManager, facilitator, coverFacilitator],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const result = presenter.generateSelectedUsers()

      expect(result.treatmentManager).toEqual(treatmentManager)
      expect(result.facilitators).toEqual([facilitator])
      expect(result.coverFacilitators).toEqual([coverFacilitator])
    })
  })

  describe('getCreateGroupSummary', () => {
    beforeEach(() => {
      mockCreateGroupUtils.prototype.getCohortTextFromEnum = jest.fn().mockReturnValue('General offence')
      mockCreateGroupUtils.prototype.getSexTextFromEnum = jest.fn().mockReturnValue('Male')
      mockGroupDaysTimesUtils.formatStartDaysAndTimes = jest.fn().mockReturnValue(['Monday 2:00 PM - 4:00 PM'])
    })

    it('returns summary list with all group details and no team members', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary).toContainEqual({
        key: 'Group Code',
        lines: ['ABC123'],
        changeLink: '/create-group-code',
      })
      expect(summary).toContainEqual({
        key: 'Date',
        lines: ['2026-06-01'],
        changeLink: '/group-start-date',
      })
      expect(summary).toContainEqual({
        key: 'Cohort',
        lines: ['General offence'],
        changeLink: '/group-cohort',
      })
      expect(summary).toContainEqual({
        key: 'Sex',
        lines: ['Male'],
        changeLink: '/group-gender',
      })
      expect(summary).toContainEqual({
        key: 'PDU',
        lines: ['PDU North'],
        changeLink: '/group-probation-delivery-unit',
      })
      expect(summary).toContainEqual({
        key: 'Delivery Location',
        lines: ['Prison A'],
        changeLink: '/group-delivery-location',
      })
      expect(summary).toContainEqual({
        key: 'Treatment Manager:',
        lines: ['Not assigned'],
        changeLink: '/group-facilitators',
      })
      expect(summary).toContainEqual({
        key: 'Facilitators:',
        lines: ['None assigned'],
        changeLink: '/group-facilitators',
      })
    })

    it('returns summary list with assigned treatment manager', () => {
      const treatmentManager: CreateGroupTeamMember = {
        facilitator: 'John Smith',
        facilitatorCode: 'JS001',
        teamName: 'Team A',
        teamCode: 'TA001',
        teamMemberType: 'TREATMENT_MANAGER',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [treatmentManager],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary).toContainEqual({
        key: 'Treatment Manager:',
        lines: ['John Smith'],
        changeLink: '/group-facilitators',
      })
    })

    it('returns summary list with assigned facilitators', () => {
      const facilitator1: CreateGroupTeamMember = {
        facilitator: 'Jane Doe',
        facilitatorCode: 'JD001',
        teamName: 'Team B',
        teamCode: 'TB001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const facilitator2: CreateGroupTeamMember = {
        facilitator: 'Bob Johnson',
        facilitatorCode: 'BJ001',
        teamName: 'Team C',
        teamCode: 'TC001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [facilitator1, facilitator2],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary).toContainEqual({
        key: 'Facilitators:',
        lines: ['Jane Doe', 'Bob Johnson'],
        changeLink: '/group-facilitators',
      })
    })

    it('does not include cover facilitators section when none are assigned', () => {
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      const coverFacilitatorItem = summary.find(item => item.key === 'Cover facilitators:')
      expect(coverFacilitatorItem).toBeUndefined()
    })

    it('includes cover facilitators section when they are assigned', () => {
      const coverFacilitator1: CreateGroupTeamMember = {
        facilitator: 'Alice Brown',
        facilitatorCode: 'AB001',
        teamName: 'Team D',
        teamCode: 'TD001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      const coverFacilitator2: CreateGroupTeamMember = {
        facilitator: 'Charlie Wilson',
        facilitatorCode: 'CW001',
        teamName: 'Team E',
        teamCode: 'TE001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [coverFacilitator1, coverFacilitator2],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary).toContainEqual({
        key: 'Cover facilitators:',
        lines: ['Alice Brown', 'Charlie Wilson'],
        changeLink: '/group-facilitators',
      })
    })

    it('calls GroupDaysTimesUtils to format days and times', () => {
      const sessionSlots: CreateGroupSessionSlot[] = [
        {
          dayOfWeek: 'MONDAY',
          hour: 2,
          minutes: 0,
          amOrPm: 'PM',
        },
      ]
      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: sessionSlots,
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      presenter.getCreateGroupSummary()

      expect(mockGroupDaysTimesUtils.formatStartDaysAndTimes).toHaveBeenCalledWith(sessionSlots)
    })

    it('includes day and time summary line from GroupDaysTimesUtils', () => {
      mockGroupDaysTimesUtils.formatStartDaysAndTimes = jest
        .fn()
        .mockReturnValue(['Monday 2:00 PM - 4:00 PM', 'Wednesday 10:00 AM - 12:00 PM'])

      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [] as CreateGroupSessionSlot[],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary).toContainEqual({
        key: 'Day and time',
        lines: ['Monday 2:00 PM - 4:00 PM', 'Wednesday 10:00 AM - 12:00 PM'],
        changeLink: '/group-days-and-times',
      })
    })

    it('returns summary with all details correctly formatted', () => {
      const treatmentManager: CreateGroupTeamMember = {
        facilitator: 'John Smith',
        facilitatorCode: 'JS001',
        teamName: 'Team A',
        teamCode: 'TA001',
        teamMemberType: 'TREATMENT_MANAGER',
      }
      const facilitator: CreateGroupTeamMember = {
        facilitator: 'Jane Doe',
        facilitatorCode: 'JD001',
        teamName: 'Team B',
        teamCode: 'TB001',
        teamMemberType: 'REGULAR_FACILITATOR',
      }
      const coverFacilitator: CreateGroupTeamMember = {
        facilitator: 'Alice Brown',
        facilitatorCode: 'AB001',
        teamName: 'Team D',
        teamCode: 'TD001',
        teamMemberType: 'COVER_FACILITATOR',
      }
      mockGroupDaysTimesUtils.formatStartDaysAndTimes = jest.fn().mockReturnValue(['Monday 2:00 PM - 4:00 PM'])

      const createGroupFormData: Partial<CreateGroupRequest> = {
        groupCode: 'ABC123',
        earliestStartDate: '2026-06-01',
        createGroupSessionSlot: [] as CreateGroupSessionSlot[],
        cohort: 'GENERAL',
        sex: 'MALE',
        pduName: 'PDU North',
        deliveryLocationName: 'Prison A',
        teamMembers: [treatmentManager, facilitator, coverFacilitator],
      }
      const presenter = new CreateGroupCyaPresenter(createGroupFormData)

      const summary = presenter.getCreateGroupSummary()

      expect(summary.length).toBe(10) // All 10 items including cover facilitators
      expect(summary[0].key).toBe('Group Code')
      expect(summary[1].key).toBe('Date')
      expect(summary[2].key).toBe('Day and time')
      expect(summary[3].key).toBe('Cohort')
      expect(summary[4].key).toBe('Sex')
      expect(summary[5].key).toBe('PDU')
      expect(summary[6].key).toBe('Delivery Location')
      expect(summary[7].key).toBe('Treatment Manager:')
      expect(summary[8].key).toBe('Facilitators:')
      expect(summary[9].key).toBe('Cover facilitators:')
    })
  })
})
