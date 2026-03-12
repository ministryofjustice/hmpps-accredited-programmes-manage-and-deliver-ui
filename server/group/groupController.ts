import { Request, Response } from 'express'
import { Group } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'
import GroupView from './groupView'
import { Page } from '../shared/models/pagination'
import GroupListFilter from '../groupOverview/groupListFilter'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'

export default class GroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showNotStartedGroupListPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const pageNumber = req.query.page
    const selectedTab = 'NOT_STARTED OR_IN_PROGRESS'

    const filters = GroupListFilter.fromRequest(req)

    const notStartedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 50,
      },
      filters.params,
      selectedTab,
    )

    const presenter = new GroupPresenter(
      notStartedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED_OR_IN_PROGRESS,
      notStartedGroupList.otherTabTotal,
      notStartedGroupList.regionName,
      filters,
      notStartedGroupList.probationDeliveryUnitNames,
      notStartedGroupList.deliveryLocationNames,
    )
    const view = new GroupView(presenter)

    return this.renderPage(res, view)
  }

  async showCompletedGroupListPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const pageNumber = req.query.page
    const selectedTab = 'COMPLETE'

    const filters = GroupListFilter.fromRequest(req)

    const completedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 50,
      },
      filters.params,
      selectedTab,
    )

    const presenter = new GroupPresenter(
      completedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.COMPLETE,
      completedGroupList.otherTabTotal,
      completedGroupList.regionName,
      filters,
      completedGroupList.probationDeliveryUnitNames,
      completedGroupList.deliveryLocationNames,
    )
    const view = new GroupView(presenter)

    return this.renderPage(res, view)
  }
}
