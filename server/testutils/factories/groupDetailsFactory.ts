import { Group, GroupDetailsResponse } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class GroupDetailsFactory extends Factory<GroupDetailsResponse> {}

export default GroupDetailsFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  code: `ABC1234`,
  regionName: `Region ${sequence}`,
  startDate: 'Wednesday 1 April 2026',
  pduName: `PDU ${sequence}`,
  deliveryLocation: `Location ${sequence}`,
  cohort: 'GENERAL' as Group['cohort'],
  sex: 'MALE' as Group['sex'],
  daysAndTimes: ['Mondays 10am to 12:30pm, Fridays 11am to 1:30pm'],
  currentlyAllocatedNumber: 3,
  treatmentManager: 'Treatment Manager',
  facilitators: ['Facilitator 1', 'Facilitator 2'],
  coverFacilitators: ['Cover Facilitator'],
}))
