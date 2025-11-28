import { Group } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class GroupFactory extends Factory<Group> {}

export default GroupFactory.define(({ sequence }) => ({
  id: sequence.toString(),
  code: `ABC1234`,
  regionName: `Region ${sequence}`,
  earliestStartDate: '2024-01-01',
  startDate: '2024-02-01',
  pduName: `PDU ${sequence}`,
  deliveryLocation: `Location ${sequence}`,
  cohort: 'GENERAL' as Group['cohort'],
  sex: 'MALE' as Group['sex'],
}))
