import { Group, GroupsByRegion } from '@manage-and-deliver-api'
import { Factory } from 'fishery'
import pageFactory from './pageFactory'
import GroupFactory from './groupFactory'
import { Page } from '../../shared/models/pagination'

class GroupsByRegionFactory extends Factory<GroupsByRegion> {}

export default GroupsByRegionFactory.define(() => ({
  pagedGroupData: pageFactory.pageContent([GroupFactory.build()]).build() as Page<Group>,
  otherTabTotal: 10,
  regionName: 'test region name',
}))
