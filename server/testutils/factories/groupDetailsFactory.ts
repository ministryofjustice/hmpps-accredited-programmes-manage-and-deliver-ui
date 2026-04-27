import { Group, GroupDetailsResponse } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class GroupDetailsFactory extends Factory<GroupDetailsResponse> {}

export default GroupDetailsFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  code: `ABC1234`,
  regionName: `Region ${sequence}`,
  startDate: 'Wednesday 1 April 2026',
  pduName: `PDU ${sequence}`,
  pduCode: 'PDU123',
  deliveryLocation: `Location ${sequence}`,
  deliveryLocationCode: 'LOC0001',
  cohort: 'GENERAL' as Group['cohort'],
  sex: 'MALE' as Group['sex'],
  daysAndTimes: ['Mondays 10am to 12:30pm, Fridays 11am to 1:30pm'],
  currentlyAllocatedNumber: 3,
  treatmentManager: {
    facilitator: 'Treatment Manager',
    facilitatorCode: 'TM001',
    teamName: 'Team A',
    teamCode: 'TEAM001',
    teamMemberType: 'TREATMENT_MANAGER' as const,
  },
  facilitators: [
    {
      facilitator: 'Facilitator 1',
      facilitatorCode: 'F001',
      teamName: 'Team A',
      teamCode: 'TEAM001',
      teamMemberType: 'REGULAR_FACILITATOR' as const,
    },
    {
      facilitator: 'Facilitator 2',
      facilitatorCode: 'F002',
      teamName: 'Team B',
      teamCode: 'TEAM002',
      teamMemberType: 'REGULAR_FACILITATOR' as const,
    },
  ],
  coverFacilitators: [
    {
      facilitator: 'Cover Facilitator',
      facilitatorCode: 'CF001',
      teamName: 'Team C',
      teamCode: 'TEAM003',
      teamMemberType: 'COVER_FACILITATOR' as const,
    },
  ],
}))
