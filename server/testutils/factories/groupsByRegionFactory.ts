import { Group, GroupsByRegion } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import { Page } from '../../shared/models/pagination'
import GroupFactory from './groupFactory'
import pageFactory from './pageFactory'

class GroupsByRegionFactory extends Factory<GroupsByRegion> {}

export default GroupsByRegionFactory.define(() => ({
  pagedGroupData: pageFactory.pageContent([GroupFactory.build()]).build() as Page<Group>,
  otherTabTotal: 10,
  regionName: 'test region name',
  probationDeliveryUnitNames: ['PDU1', 'PDU2', 'PDU3'],
}))
