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
    facilitatorForename: 'Treatment',
    facilitatorSurname: 'Manager',
    facilitatorCode: '1234',
    teamName: 'Team A',
    teamCode: '9876',
    teamMemberType: 'TREATMENT_MANAGER' as 'TREATMENT_MANAGER' | 'REGULAR_FACILITATOR' | 'COVER_FACILITATOR',
  },
  facilitators: [
    {
      facilitatorForename: 'Facilitator',
      facilitatorSurname: '1',
      facilitatorCode: '1111',
      teamName: 'Team A',
      teamCode: '9876',
      teamMemberType: 'REGULAR_FACILITATOR' as 'TREATMENT_MANAGER' | 'REGULAR_FACILITATOR' | 'COVER_FACILITATOR',
    },
    {
      facilitatorForename: 'Facilitator',
      facilitatorSurname: '2',
      facilitatorCode: '2222',
      teamName: 'Team A',
      teamCode: '9876',
      teamMemberType: 'REGULAR_FACILITATOR' as 'TREATMENT_MANAGER' | 'REGULAR_FACILITATOR' | 'COVER_FACILITATOR',
    },
  ],
  coverFacilitators: [
    {
      facilitatorForename: 'Cover',
      facilitatorSurname: 'Facilitator',
      facilitatorCode: '9876',
      teamName: 'Team A',
      teamCode: '9876',
      teamMemberType: 'COVER_FACILITATOR' as 'TREATMENT_MANAGER' | 'REGULAR_FACILITATOR' | 'COVER_FACILITATOR',
    },
  ],
}))
